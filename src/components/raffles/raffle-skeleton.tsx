import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function RaffleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 flex flex-col">
        <Skeleton className="h-32 w-full" />
        <div className="p-3">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}

export function ClosedRaffleItemSkeleton() {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
