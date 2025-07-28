import Link from "next/link";
import { getAllToolsForAdmin, deleteTool } from "@/lib/shared/tools";
import { parseFormBody } from "@/lib/form-helpers";

export async function getServerSideProps({ req, res }) {
    if (req.method === "POST") {
        const { _action, id } = await parseFormBody(req);

        if (_action === "delete" && id) {
            try {
                await deleteTool(id);
                res.writeHead(302, { Location: "/tools" });
                res.end();
                return { props: {} };
            } catch (error) {
                console.error("Failed to delete tool:", error);
            }
        }
    }

    const allTools = await getAllToolsForAdmin();

    return {
        props: {
            tools: allTools,
        },
    };
}

export default function ToolsPage({ tools }) {
    return (
        <div className="w-[80%] mx-auto">
            <div><Link href="/" className="text-emerald-300 hover:text-emerald-400 mb-6 inline-block">&larr; Back to Main Menu</Link></div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-100">Manage Tools</h1>
                <Link href="/tools/new" className="bg-emerald-500 text-gray-100 font-bold py-2 px-4 rounded hover:bg-emerald-600 transition-colors">
                    + New Tool
                </Link>
            </div>
            <div className="overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">Website</th>
                            <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">Description</th>
                            <th className="px-5 py-3 bg-gray-800 text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 bg-gray-800 text-right text-xs font-semibold text-gray-100 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tools.map((tool) => (
                            <tr key={tool.id} className="bg-cardDark border border-gray-600 hover:bg-gray-800">
                                <td className="px-5 py-4 text-sm text-gray-400">{tool.Name}</td>
                                <td className="px-5 py-4 text-sm text-gray-400"><Link href={`${tool.Website}`} className="text-emerald-300 hover:text-emerald-400 mr-4">{tool.Website}</Link></td>
                                <td className="px-5 py-4 text-sm text-gray-400">{tool.Description.length > 50 ? `${tool.Description.substring(0, 50)} ...` : tool.Description}</td>
                                <td className="px-5 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${tool.Active ? 'bg-emerald-500 text-gray-100' : 'bg-yellow-200 text-yellow-800'}`}>{tool.Active ? 'Active' : 'Inactive'}</span></td>
                                <td className="px-5 py-4 text-sm text-right">
                                    <Link href={`/tools/edit/${tool.id}`} className="text-emerald-300 hover:text-emerald-400 mr-4">Edit</Link>
                                    <form method="POST" action="/tools" style={{ display: 'inline' }} onSubmit={(e) => { if (!window.confirm("Are you sure you want to delete this tool?")) e.preventDefault(); }}>
                                        <input type="hidden" name="_action" value="delete" />
                                        <input type="hidden" name="id" value={tool.id} />
                                        <button type="submit" className="text-red-500 hover:text-red-600">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}