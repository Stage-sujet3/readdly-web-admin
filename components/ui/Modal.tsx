export default function Modal({ children }: { children: React.ReactNode }) {
    return (
        <div className="modal">
            <div className="modal-content">{children}</div>
        </div>
    )
}
