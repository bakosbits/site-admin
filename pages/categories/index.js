import Link from "next/link";
import { getAllCategoriesForAdmin, deleteCategory } from "@/lib/shared/categories";
import { parseFormBody } from "@/lib/form-helpers";

export async function getServerSideProps({ req, res }) {
    if (req.method === "POST") {
        const { _action, id } = await parseFormBody(req);

        if (_action === "delete" && id) {
            try {
                await deleteCategory(id);
                res.writeHead(302, { Location: "/categories" });
                res.end();
                return { props: {} };
            } catch (error) {
                console.error("Failed to delete category:", error);
            }
        }
    }

    const categories = await getAllCategoriesForAdmin();
    return {
        props: {
            categories,
        },
    };
}

export default function CategoriesPage({ categories }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-headingWhite">Manage Categories</h1>
                <Link href="/categories/new" className="bg-accentGreen text-backgroundDark font-bold py-2 px-4 rounded hover:bg-headingWhite transition-colors">
                    + New Category
                </Link>
            </div>
            <div className="bg-cardDark shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="px-5 py-4 text-sm text-gray-300">{category.Name}</td>
                                <td className="px-5 py-4 text-sm text-gray-400">{category.Description}</td>
                                <td className="px-5 py-4 text-sm text-right">
                                    <Link href={`/categories/edit/${category.id}`} className="text-accentGreen hover:text-headingWhite mr-4">Edit</Link>
                                    <form method="POST" action="/categories" style={{ display: 'inline' }} onSubmit={(e) => { if (!window.confirm("Are you sure you want to delete this category?")) e.preventDefault(); }}>
                                        <input type="hidden" name="_action" value="delete" />
                                        <input type="hidden" name="id" value={category.id} />
                                        <button type="submit" className="text-red-500 hover:text-headingWhite">Delete</button>
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