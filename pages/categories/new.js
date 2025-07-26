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
        <div>
            <h1 className="text-3xl font-bold text-headingWhite mb-6">New Category</h1>
            <CategoryForm error={error} />
        </div>
    );
}