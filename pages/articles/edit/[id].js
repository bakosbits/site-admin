import { getArticleById, updateArticle } from "@/lib/shared/articles";
import ArticleForm from "@/components/ArticleForm";
import Link from "next/link";
import { parseFormBody, prepareArticleData } from "@/lib/form-helpers";

export async function getServerSideProps({ req, res, params }) {
    const { id } = params;

    if (req.method === "POST") {
        try {
            const formData = await parseFormBody(req);
            const articleData = prepareArticleData(formData);

            await updateArticle(id, articleData);

            // Redirect to the articles list on success
            res.writeHead(302, { Location: "/articles" });
            res.end();
            return { props: {} };
        } catch (error) {
            console.error(`Failed to update article ${id}:`, error);
            // If update fails, re-fetch the article data and render the form with an error
            const article = await getArticleById(id);
            return {
                props: {
                    article,
                    error: error.message || "Something went wrong.",
                },
            };
        }
    }

    // For GET requests, fetch the article and render the form
    const article = await getArticleById(id);

    if (!article) {
        return { notFound: true };
    }

    return {
        props: {
            article,
            error: null,
        },
    };
}

export default function EditArticlePage({ article, error }) {
    return (
        <div className="w-[80%] mx-auto">
            <Link href="/articles" className="text-emerald-300 hover:text-emerald-400 mb-6 inline-block">&larr; Back to Articles</Link>
            <h1 className="text-3xl font-bold text-gray-100 mb-6">Edit Article</h1>
            <ArticleForm article={article} error={error} />
        </div>
    );
}