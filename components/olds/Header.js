export default function Header(props) {
    return (
        <div>
            <h1 className="bg-secondary px-3 text-white display-4 text-left">
                {props.header}
            </h1>
        </div>
    )
}