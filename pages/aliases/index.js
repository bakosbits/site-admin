import Link from "next/link";
import { getAllAliasesForAdmin, deleteAlias } from "@/lib/shared/aliases";
import { parseFormBody } from "@/lib/form-helpers";

export async function getServerSideProps({ req, res }) {
    if (req.method === "POST") {
        const { _action, id } = await parseFormBody(req);

        if (_action === "delete" && id) {
            try {
                await deleteAlias(id);
                res.writeHead(302, { Location: "/aliases" });
                res.end();
                return { props: {} };
            } catch (error) {
                console.error("Failed to delete alias:", error);
            }
        }
    }

    const aliases = await getAllAliasesForAdmin();
    return {
        props: {
            aliases,
        },
    };
}

export default function AliasesPage({ aliases }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-headingWhite">Manage Aliases</h1>
                <Link href="/aliases/new" className="bg-accentGreen text-backgroundDark font-bold py-2 px-4 rounded hover:bg-headingWhite transition-colors">
                    + New Alias
                </Link>
            </div>
            <div className="bg-cardDark shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Aliases</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aliases.map((alias) => (
                            <tr key={alias.id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="px-5 py-4 text-sm text-gray-300">{alias.Name}</td>
                                <td className="px-5 py-4 text-sm text-gray-300">{alias.Type}</td>            
                                <td className="px-5 py-4 text-sm text-gray-400 truncate max-w-xs">{alias.Aliases}</td>
                                <td className="px-5 py-4 text-sm text-right">
                                    <Link href={`/aliases/edit/${alias.id}`} className="text-accentGreenhover:text-headingWhite mr-4">Edit</Link>
                                    <form method="POST" action="/aliases" style={{ display: 'inline' }} onSubmit={(e) => { if (!window.confirm("Are you sure you want to delete this alias?")) e.preventDefault(); }}>
                                        <input type="hidden" name="_action" value="delete" />
                                        <input type="hidden" name="id" value={alias.id} />
                                        <button type="submit" className="text-red-500 hover:text-headingWhite0">Delete</button>
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