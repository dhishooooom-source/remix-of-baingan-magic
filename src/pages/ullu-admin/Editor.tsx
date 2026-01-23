import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import frontMatter from "front-matter";

interface EditorProps {
    isNew?: boolean;
}

export default function UlluEditor({ isNew = false }: EditorProps) {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [sha, setSha] = useState<string | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [author, setAuthor] = useState("observer");
    const [body, setBody] = useState("");

    useEffect(() => {
        if (!isNew && slug) {
            loadFile(slug);
        }
    }, [isNew, slug]);

    const loadFile = async (fileSlug: string) => {
        const token = sessionStorage.getItem("gh_token");
        if (!token) {
            navigate("/ullu-admin");
            return;
        }

        try {
            const res = await fetch(`/api/github/files?path=content/ullu/${fileSlug}.md`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setSha(data.sha);
                const decodedContent = atob(data.content);

                const parsed = frontMatter(decodedContent);
                const attr = (parsed.attributes || {}) as any;

                if (attr.date) {
                    try {
                        setDate(new Date(attr.date).toISOString().split("T")[0]);
                    } catch (e) {
                        setDate(attr.date);
                    }
                }
                if (attr.author) setAuthor(attr.author);
                setBody(parsed.body);
            } else {
                alert("Failed to load file");
                navigate("/ullu-admin");
            }
        } catch (e) {
            console.error(e);
            alert("Error loading file");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = sessionStorage.getItem("gh_token");

        const finalContent = `---
date: ${date}
author: ${author}
---

${body}`;

        let finalSlug = slug;
        if (isNew) {
            const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
            const safeAuthor = author.replace(/[^a-z0-9]/gi, "-").toLowerCase();
            finalSlug = `${date}-${timestamp}-${safeAuthor}`;
        }

        const path = `content/ullu/${finalSlug}.md`;
        const message = isNew ? `Create ${finalSlug}` : `Update ${finalSlug}`;

        try {
            const res = await fetch("/api/github/write", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    path,
                    content: finalContent,
                    message,
                    sha: isNew ? undefined : sha
                })
            });

            if (res.ok) {
                window.location.href = "/ullu-admin";
            } else {
                const err = await res.json();
                alert("Failed to save: " + JSON.stringify(err));
            }
        } catch (e) {
            console.error(e);
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = () => setShowDeleteModal(true);

    const handleDelete = async () => {
        const token = sessionStorage.getItem("gh_token");
        const path = `content/ullu/${slug}.md`;
        setShowDeleteModal(false);

        try {
            const res = await fetch(`/api/github/delete?path=${path}&sha=${sha}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                window.location.href = "/ullu-admin";
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white p-8 font-mono">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-[#e6e6e6] font-mono p-8 max-w-4xl mx-auto relative">
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#111] border border-[#333] p-8 max-w-md w-full rounded shadow-2xl text-center">
                        <h3 className="text-xl text-red-500 uppercase tracking-widest mb-4">Confirm Deletion</h3>
                        <p className="text-gray-400 mb-8">Are you sure you want to delete this pravachan? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 border border-[#333] hover:bg-[#222] text-white rounded uppercase text-sm">Cancel</button>
                            <button onClick={handleDelete} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded uppercase text-sm font-bold">Delete Forever</button>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h1 className="text-xl text-[#7affc0] uppercase">{isNew ? "New Pravachan" : `Edit: ${slug}`}</h1>
                <div className="flex gap-4">
                    {!isNew && <button onClick={confirmDelete} className="text-red-500 hover:text-red-400 text-sm uppercase">[Delete]</button>}
                    <button onClick={() => navigate("/ullu-admin")} className="text-gray-500 hover:text-white text-sm uppercase">[Cancel]</button>
                </div>
            </header>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 rounded text-white focus:border-[#7affc0] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Author</label>
                        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 rounded text-white focus:border-[#7affc0] outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Pravachan Body</label>
                    <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full h-[60vh] bg-[#111] border border-[#333] p-4 rounded text-white focus:border-[#7affc0] outline-none font-sans font-light text-lg leading-relaxed resize-none" placeholder="Write your truth..." />
                </div>

                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving} className="bg-[#7affc0] text-black px-8 py-3 rounded uppercase tracking-widest hover:bg-white transition-colors font-bold disabled:opacity-50">
                        {saving ? "Saving..." : "Save Pravachan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
