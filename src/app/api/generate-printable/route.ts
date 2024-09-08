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
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Define font size, padding, and margin
        const fontSize = 24;
        const verticalMargin = 180;  // Increase vertical margin between vocab words
        const lineMargin = 10;
        const leftRightPadding = 50; // Left and right padding to create horizontal margins

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
        let yPosition = height - verticalMargin; // Start at the top with some extra vertical margin

        // Function to get text width
        const getTextWidth = (text: string, size: number) => {
            return font.widthOfTextAtSize(text, size);
        };

        // Function to split text into multiple lines based on page width
        const splitTextIntoLines = (text: string, maxWidth: number, size: number) => {
            const words = text.split(' ');
            let currentLine = '';
            const lines = [];

            words.forEach((word) => {
                const newLine = currentLine.length ? currentLine + ' ' + word : word;
                if (getTextWidth(newLine, size) > maxWidth) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = newLine;
                }
            });

            if (currentLine.length) {
                lines.push(currentLine);
            }

            return lines;
        };

        // Loop through the vocab array and add each pair to the page
        body.vocab.forEach(([word, description], index) => {
            // Check if the current position will overflow
            if (yPosition - fontSize - lineMargin - verticalMargin < verticalMargin) {
                // If it overflows, create a new page and reset yPosition
                page = createNewPage();
                yPosition = height - verticalMargin;
            }

            // Calculate text sizes
            const wordFontSize = word.length > 33 ? 16 : fontSize;
            const descriptionFontSize = description.length > 50 ? 16 : fontSize;

            // Split the description into lines if it's too wide
            const wordWidth = getTextWidth(word, wordFontSize);
            const descriptionLines = splitTextIntoLines(description, width / 2 - leftRightPadding, descriptionFontSize);

            // Calculate x positions for text
            const xPositionWord = leftRightPadding; // Add left padding
            const xPositionDescription = width / 2 + leftRightPadding; // Add right padding

            // Draw the word on the left
            page.drawText(word, {
                x: xPositionWord,
                y: yPosition,
                size: wordFontSize,
                font: font,
                color: rgb(0, 0, 0), // black text
            });

            // Draw each line of the description on the right
            descriptionLines.forEach((line) => {
                if (yPosition - descriptionFontSize - lineMargin < verticalMargin) {
                    // Create a new page if the text overflows
                    page = createNewPage();
                    yPosition = height - verticalMargin;
                }

                page.drawText(line, {
                    x: xPositionDescription,
                    y: yPosition,
                    size: descriptionFontSize,
                    font: font,
                    color: rgb(0, 0, 0), // black text
                });

                // Adjust yPosition for the next line
                yPosition -= descriptionFontSize + lineMargin;
            });

            // Adjust yPosition for the next pair of word and description, adding vertical margin
            yPosition -= fontSize + verticalMargin;
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
