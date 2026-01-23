import React from "react";

export default function AdminShell() {
    return (
        <div style={{
            background: "#000",
            minHeight: "100vh",
            padding: "40px",
            color: "white",
            fontFamily: '"VT323", monospace'
        }}>
            <iframe
                src="/admin/index.html"
                title="Admin Panel"
                style={{
                    width: "100%",
                    height: "90vh",
                    border: "1px solid #222",
                    borderRadius: "12px",
                    background: "black"
                }}
            />
        </div>
    );
}
