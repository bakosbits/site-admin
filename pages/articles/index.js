import Link from "next/link";
import { getAllArticlesForAdmin, deleteArticle } from "@/lib/shared/articles";
import { parseFormBody } from "@/lib/form-helpers";

// This function runs on the server for every request to /articles
export async function getServerSideProps({ req, res }) {
    // Handle DELETE request via a POST form submission
    if (req.method === "POST") {
        const { _action, id } = await parseFormBody(req);

        if (_action === "delete" && id) {
            try {
                await deleteArticle(id);
                // Redirect to the same page to see the updated list
                res.writeHead(302, { Location: "/articles" });
                res.end();
                return { props: {} };
            } catch (error) {
                console.error("Failed to delete article:", error);
                // You could pass an error message to the page here
            }
        }
    }

    // For GET requests, fetch and display the articles
    const articles = await getAllArticlesForAdmin();
    return {
        props: {
            articles,
        },
    };
}

export default function ArticlesPage({ articles }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-headingWhite">Manage Articles</h1>
                <Link href="/articles/new" className="bg-accentGreen text-backgroundDark font-bold py-2 px-4 rounded hover:bg-headingWhite transition-colors">
                    + New Article
                </Link>
            </div>
            <div className="bg-cardDark shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="px-5 py-4 text-sm text-gray-300">{article.Title}</td>
                                <td className="px-5 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${article.Published ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{article.Published ? 'Published' : 'Draft'}</span></td>
                                <td className="px-5 py-4 text-sm text-right">
                                    <Link href={`/articles/edit/${article.id}`} className="text-accentGreenhover:text-headingWhite mr-4">Edit</Link>
                                    <form method="POST" action="/articles" style={{ display: 'inline' }} onSubmit={(e) => { if (!window.confirm("Are you sure you want to delete this article?")) e.preventDefault(); }}>
                                        <input type="hidden" name="_action" value="delete" />
                                        <input type="hidden" name="id" value={article.id} />
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