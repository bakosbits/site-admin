import { getCategoryById, updateCategory } from "@/lib/shared/categories";
import CategoryForm from "@/components/CategoryForm";
import Link from "next/link";
import { parseFormBody } from "@/lib/form-helpers";

export async function getServerSideProps({ req, res, params }) {
    const { id } = params;

    if (req.method === "POST") {
        try {
            const categoryData = await parseFormBody(req);
            await updateCategory(id, categoryData);

            res.writeHead(302, { Location: "/categories" });
            res.end();
            return { props: {} };
        } catch (error) {
            console.error(`Failed to update category ${id}:`, error);
            const category = await getCategoryById(id);
            return {
                props: {
                    category,
                    error: error.message || "Something went wrong.",
                },
            };
        }
    }

    const category = await getCategoryById(id);

    if (!category) {
        return { notFound: true };
    }

    return {
        props: {
            category,
            error: null,
        },
    };
}

export default function EditCategoryPage({ category, error }) {
    return (
        <div>
            <Link href="/categories" className="text-accentGreenhover:text-headingWhite mb-6 inline-block">&larr; Back to Categories</Link>
            <h1 className="text-3xl font-bold text-headingWhite mb-6">Edit Category</h1>
            <CategoryForm category={category} error={error} />
        </div>
    );
}