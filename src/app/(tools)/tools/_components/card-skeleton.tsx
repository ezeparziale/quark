import GridCard from "./grid-card"
import ListCard from "./list-card"

export default function CardSkeleton({ view }: { view: string }) {
  return (
    <div className="flex flex-col space-y-3">
      {view === "grid" && (
        <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <GridCard.Skeleton key={i} />
            ))}
        </div>
      )}
      {view === "list" && (
        <div className="my-6 grid gap-5">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <ListCard.Skeleton key={i} />
            ))}
        </div>
      )}
    </div>
  )
}
