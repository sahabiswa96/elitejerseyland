import SearchResultsClient from "./search-results-client";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim();

  return <SearchResultsClient initialQuery={query} />;
}