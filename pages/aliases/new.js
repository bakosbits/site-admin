import { createAlias } from "@/lib/shared/aliases";
import AliasForm from "@/components/AliasForm";
import { parseFormBody } from "@/lib/form-helpers";

export async function getServerSideProps({ req, res }) {
    if (req.method === "POST") {
        try {
            const aliasData = await parseFormBody(req);
            await createAlias(aliasData);

            res.writeHead(302, { Location: "/aliases" });
            res.end();
            return { props: {} };
        } catch (error) {
            console.error("Failed to create alias:", error);
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

export default function NewAliasPage({ error }) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-headingWhite mb-6">New Alias</h1>
            <AliasForm error={error} />
        </div>
    );
}