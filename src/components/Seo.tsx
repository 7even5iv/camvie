interface Props {
    title?: string;
    description?: string;
}

const SITE_NAME = 'CAMVIE SARL';
const DEFAULT_DESCRIPTION =
    'CAMVIE SARL — Intermédiation foncière et conseils, commerce général, import & export au Cameroun.';

export default function Seo({ title, description = DEFAULT_DESCRIPTION }: Props) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
        </>
    );
}