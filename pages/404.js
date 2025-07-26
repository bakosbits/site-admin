export default function Custom404() {
    return (
            <div className="flex flex-col justify-center items-center bg-backgroundDark px-6 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4 text-headingWhite">
                    Oops. Well, that doesn't seem to exist.
                </h1>
                <p className="mb-8 text-grayText">
                    We couldn’t locate what you were looking for. It must be a
                    glitch.
                </p>
            </div>
    );
}
