import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

function SiteAdmin({ Component, pageProps }) {
    const router = useRouter();

    return (
        <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default SiteAdmin;
