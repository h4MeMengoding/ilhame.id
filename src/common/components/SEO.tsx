import Head from 'next/head';
import { NextSeo, NextSeoProps } from 'next-seo';

interface StructuredData {
  [key: string]: any;
}

interface SEOProps extends NextSeoProps {
  structuredData?: StructuredData[];
}

const SEO = ({ structuredData, ...nextSeoProps }: SEOProps) => {
  return (
    <>
      <NextSeo {...nextSeoProps} />
      {structuredData && (
        <Head>
          {structuredData.map((data, index) => (
            <script
              key={index}
              type='application/ld+json'
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(data),
              }}
            />
          ))}
        </Head>
      )}
    </>
  );
};

export default SEO;
