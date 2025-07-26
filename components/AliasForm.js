import Link from "next/link";

export default function AliasForm({ alias, error }) {
    const isNew = !alias?.id;

    return (
        <form method="POST" className="space-y-6 bg-cardDark p-8 rounded-lg">
            {error && <div className="bg-red-800 text-white p-3 rounded mb-4">Error: {error}</div>}

            <div>
                <label htmlFor="Type" className="block text-sm font-medium text-gray-300">Type</label>
                <input type="text" name="Type" id="Type" required className="w-full mt-1 px-4 py-2 rounded-md bg-backgroundDark text-headingWhite placeholder-text-headingWhite border border-gray-600" defaultValue={alias?.Type || ''} />
            </div>

            <div>
                <label htmlFor="Name" className="block text-sm font-medium text-gray-300">Name</label>
                <input type="text" name="Name" id="Name" required className="w-full mt-1 px-4 py-2 rounded-md bg-backgroundDark text-headingWhite placeholder-text-headingWhite border border-gray-600" defaultValue={alias?.Name || ''} />
            </div>

            <div>
                <label htmlFor="Aliases" className="block text-sm font-medium text-gray-300">Aliases (comma-separated)</label>
                <input type="text" name="Aliases" id="Aliases" className="w-full mt-1 px-4 py-2 rounded-md bg-backgroundDark text-headingWhite placeholder-text-headingWhite border border-gray-600" defaultValue={alias?.Aliases || ''} />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <Link href="/aliases" className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition-colors">Cancel</Link>
                <button type="submit" className="bg-accentGreen text-backgroundDark font-bold py-2 px-4 rounded hover:bg-headingWhite transition-colors">{isNew ? 'Create Alias' : 'Update Alias'}</button>
            </div>
        </form>
    );
}