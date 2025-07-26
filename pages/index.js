import Link from "next/link";

export default function AdminDashboard() {
    const resources = ["Tools", "Categories", "Aliases", "Articles"];

    return (
        <div>
            <h1 className="text-3xl font-bold text-headingWhite mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {resources.map((resource) => (
                    <Link
                        key={resource}
                        href={`/${resource.toLowerCase()}`}
                        className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors text-center">
                        <h2 className="text-xl font-semibold text-headingWhite">Manage {resource}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
}
