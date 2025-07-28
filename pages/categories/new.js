import { createCategory } from "@/lib/shared/categories";
import CategoryForm from "@/components/CategoryForm";
import { parseFormBody } from "@/lib/form-helpers";

export async function getServerSideProps({ req, res }) {
    if (req.method === "POST") {
        try {
            const categoryData = await parseFormBody(req);
            await createCategory(categoryData);

            res.writeHead(302, { Location: "/categories" });
            res.end();
            return { props: {} };
        } catch (error) {
            console.error("Failed to create category:", error);
            return {
                props: {
                    error: error.message || "Something went wrong.",
                },
            };
        }
    }

    return {
        props: {
            error: null,
        },
    };
}

export default function NewCategoryPage({ error }) {
    return (
        <div className="w-[80%] mx-auto">
            <Link href="/categories"  className="text-emerald-300 hover:text-emerald-400 mb-6 inline-block">&larr; Back to Categories</Link>
            <h1 className="text-3xl font-bold text-gray-100 mb-6">New Category</h1>
            <CategoryForm error={error} />
        </div>
    );
}