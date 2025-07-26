import Link from "next/link";

export default function CategoryForm({ category, error }) {
    const isNew = !category?.id;

    return (
        <form method="POST" className="space-y-6 bg-cardDark p-8 rounded-lg">
            {error && <div className="bg-red-800 text-white p-3 rounded mb-4">Error: {error}</div>}

            <div>
                <label htmlFor="Name" className="block text-sm font-medium text-gray-300">Name</label>
                <input type="text" name="Name" id="Name" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-accentGreen focus:border-accentGreen" defaultValue={category?.Name || ''} />
            </div>

            <div>
                <label htmlFor="Description" className="block text-sm font-medium text-gray-300">Description</label>
                <textarea name="Description" id="Description" rows="4" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-accentGreen focus:border-accentGreen" defaultValue={category?.Description || ''}></textarea>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <Link href="/categories" className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition-colors">Cancel</Link>
                <button type="submit" className="bg-accentGreen text-backgroundDark font-bold py-2 px-4 rounded hover:bg-headingWhite transition-colors">{isNew ? 'Create Category' : 'Update Category'}</button>
            </div>
        </form>
    );
}