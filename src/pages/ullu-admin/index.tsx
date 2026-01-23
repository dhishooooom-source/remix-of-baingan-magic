import frontMatter from "front-matter";

// ... (other imports)

interface GitHubFile {
    name: string;
    path: string;
    sha: string;
    type: string;
    content?: string; // Add optional content field
    body?: string;   // Add parsed body
}

export default function UlluAdminDashboard() {
    const [token, setToken] = useState<string | null>(null);
    const [files, setFiles] = useState<GitHubFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<GitHubFile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const t = sessionStorage.getItem("gh_token");
        setToken(t);

        if (t) {
            fetchFiles(t);
        }
    }, []);

    const fetchFiles = async (authToken: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/github/files?path=content/ullu", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (res.ok) {
                const data = await res.json();
                let mdFiles = Array.isArray(data)
                    ? data.filter((f: any) => f.name.endsWith(".md")).sort((a: any, b: any) => b.name.localeCompare(a.name))
                    : [];

                setFiles(mdFiles);

                setFiles(mdFiles);
                // Content fetching removed to prevent rate-limit crash

            } else {
                console.error("Failed to fetch files");
                if (res.status === 401) {
                    sessionStorage.removeItem("gh_token");
                    setToken(null);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (file: GitHubFile) => {
        setFileToDelete(file);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!fileToDelete || !token) return;

        try {
            const res = await fetch(`/api/github/delete?path=content/ullu/${fileToDelete.name}&sha=${fileToDelete.sha}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setFiles(prev => prev.filter(f => f.sha !== fileToDelete.sha));
                setShowDeleteModal(false);
                setFileToDelete(null);
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogin = () => {
        window.location.href = "/api/auth/login";
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono space-y-8">
                <h1 className="text-4xl text-[#7affc0]">ULLU CMS</h1>
                <button
                    onClick={handleLogin}
                    className="px-6 py-3 border border-[#7affc0] text-[#7affc0] hover:bg-[#7affc0] hover:text-black transition-colors rounded-lg uppercase tracking-widest"
                >
                    Login with GitHub
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-[#e6e6e6] font-mono p-8 relative">
            {/* Delete Modal Overlay */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#111] border border-[#333] p-8 max-w-md w-full rounded shadow-2xl text-center">
                        <h3 className="text-xl text-red-500 uppercase tracking-widest mb-4">Confirm Deletion</h3>
                        <p className="text-gray-400 mb-8">Delete "{fileToDelete?.name}"?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2 border border-[#333] hover:bg-[#222] text-white rounded uppercase text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded uppercase text-sm font-bold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
                <h1 className="text-2xl text-[#7affc0]">ULLU PRAVACHAN ADMIN</h1>
                <Link to="/ullu-admin/new">
                    <button className="px-4 py-2 bg-[#1a1a1a] border border-[#333] hover:border-[#7affc0] text-[#7affc0] rounded transition-colors uppercase text-sm">
                        [+ New Entry]
                    </button>
                </Link>
            </header>

            {loading && files.length === 0 ? (
                <p>Loading void...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {files.map((file) => (
                        <div key={file.sha} className="bg-[#111] border border-[#222] p-6 rounded hover:border-[#7affc0] hover:translate-y-[-2px] transition-all group flex flex-col justify-between h-full min-h-[200px]">
                            {/* Content Preview */}
                            <div className="mb-4 overflow-hidden">
                                {file.body ? (
                                    <p className="text-white text-md line-clamp-4 font-sans font-light opacity-90">
                                        {file.body}
                                    </p>
                                ) : (
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-4 bg-[#222] rounded w-3/4"></div>
                                        <div className="h-4 bg-[#222] rounded w-1/2"></div>
                                        <p className="text-xs text-gray-600 mt-2">{file.name}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center border-t border-[#222] pt-4 mt-auto">
                                <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
                                    {file.name.replace(".md", "")}
                                </span>
                                <div className="flex gap-3">
                                    <Link to={`/ullu-admin/edit/${file.name.replace(".md", "")}`}>
                                        <button className="text-gray-400 hover:text-[#7affc0] text-xs uppercase tracking-wider">
                                            [Edit]
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => confirmDelete(file)}
                                        className="text-gray-400 hover:text-red-500 text-xs uppercase tracking-wider"
                                    >
                                        [Delete]
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
