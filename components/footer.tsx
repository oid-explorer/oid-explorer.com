function Footer() {
    return (
        <div
            className={"absolute bottom-0 h-24 w-screen border-t-2 flex justify-center items-center z-30 bg-white"}>
            <div>
                © {(new Date().getFullYear())} OID Explorer
            </div>
        </div>
    )
}

export default Footer