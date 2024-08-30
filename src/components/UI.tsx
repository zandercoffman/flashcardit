import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle } from "lucide-react"

export default function UI() {
  const pastSets = [
    "Mathematics",
    "History",
    "Science",
    "Literature",
    "Geography",
    "Languages",
  ]

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/3 p-6 border-r">
        <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
        <Button className="w-full mb-4">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Set
        </Button>
        <h3 className="text-lg font-semibold mb-2">Past Sets</h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {pastSets.map((set, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start mb-2"
            >
              {set}
            </Button>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 p-6 flex items-center justify-center">
        <Card className="w-96 h-60 perspective">
          <CardContent className="h-full flex items-center justify-center bg-primary text-primary-foreground text-2xl font-bold rounded-lg transform transition-transform duration-700 hover:rotate-y-180">
            <div className="backface-hidden">Sample Flashcard</div>
            <div className="absolute backface-hidden rotate-y-180">
              Flashcard Answer
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}