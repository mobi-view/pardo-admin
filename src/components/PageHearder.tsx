import Link from "next/link";

type PageHeaderProps = {
    title: string;
    actionHref?: string;
    actionLabel?: string;
};

export default function PageHeader({ title, actionHref, actionLabel }: PageHeaderProps) {
    return (
        <div className="page-header">
            <h1 className="admin-page-title">{title}</h1>
            {actionHref && actionLabel && (
                <Link href={actionHref} className="primary-link-button">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}