import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface ExpectedData {
    vocab: [string, string][];
}

export async function POST(req: NextRequest) {
    try {
        // Parse the request body to get the vocab data
        const body: ExpectedData = await req.json();

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Embed a standard font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // Using Helvetica for a clean look

        // Define font size, padding, and margin
        const fontSize = 24;
        const padding = 20;
        const lineMargin = 200; // Additional margin between lines

        // Function to create a new page
        const createNewPage = () => {
            const newPage = pdfDoc.addPage([816, 1056]);
            const { width, height } = newPage.getSize();
            newPage.drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: height,
                color: rgb(1, 1, 1), // white background
            });
            return newPage;
        };

        // Create the first page
        let page = createNewPage();
        const { width, height } = page.getSize();
        let yPosition = height - padding;

        // Function to get text width
        const getTextWidth = (text: string) => {
            return font.widthOfTextAtSize(text, fontSize);
        };

        // Loop through the vocab array and add each pair to the page
        body.vocab.forEach(([word, description], index) => {
            // Check if the current position will overflow
            if (yPosition - fontSize - lineMargin < padding) {
                // If it overflows, create a new page and reset yPosition
                page = createNewPage();
                yPosition = height - padding;
            }

            // Calculate y position for the current line
            yPosition -= (fontSize + lineMargin);

            // Calculate x positions for centered text
            const wordWidth = getTextWidth(word);
            const descriptionWidth = getTextWidth(description);
            const xPositionWord = (width - (wordWidth * 2)) / 3;
            const xPositionDescription = (width + (width / 2) - descriptionWidth) / 2;

            // Draw the word on the left, centered horizontally
            page.drawText(word, {
                x: xPositionWord,
                y: yPosition,
                size: word.length > 33 ? 10 : fontSize,
                font: font,
                color: rgb(0, 0, 0), // black text
            });

            // Draw the description on the right, centered horizontally
            page.drawText(description, {
                x: xPositionDescription,
                y: yPosition,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0), // black text
            });
        });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // Return the PDF file as a response
        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="flashcards.pdf"',
            },
        });

    } catch (err) {
        console.error('Error generating PDF:', err);
        return new NextResponse('Error generating PDF', { status: 500 });
    }
}
