import * as fs from "fs";
import * as path from "path";

const bookLocation = path.resolve(process.cwd(), "book-content/book.md");
const markdownContent = fs.readFileSync(bookLocation, "utf-8");

const rawLines = markdownContent.split("\n");

class Line {
  constructor(public line: string, public index: number) {}

  getHeadingLevel() {
    return (
      this.line.match(/^#+/)?.[0].length ||
      // Lines without a heading have a heading level of Infinity
      Infinity
    );
  }

  modify(modification: (line: string) => string) {
    this.line = modification(this.line);

    return this;
  }

  /**
   * Gets the content without the heading level
   */
  getContent() {
    return this.line.replace(/^#+\s*/, "");
  }

  isHeading() {
    return this.getHeadingLevel() > 0;
  }
}

const decoratedLines = rawLines.map((line, index) => {
  return new Line(line, index);
});

const getContentOfHeading = (line: Line) => {
  const nextHeadingOfEqualOrGreaterLevel = decoratedLines
    .slice(line.index + 1)
    .find((l) => {
      return l.getHeadingLevel() <= line.getHeadingLevel();
    });

  const endOfCurrentSectionIndex = nextHeadingOfEqualOrGreaterLevel
    ? nextHeadingOfEqualOrGreaterLevel.index - 1
    : rawLines.length;

  return {
    headingIndex: line.index,
    contentStartIndex: line.index + 1,
    endIndex: endOfCurrentSectionIndex,
  };
};

const ensureExercisesAndSolutionsHaveCorrectNumbers = (currentLine: Line) => {
  if (
    currentLine.getContent().includes("Exercises") &&
    currentLine.isHeading()
  ) {
    const { contentStartIndex, endIndex } = getContentOfHeading(currentLine);

    decoratedLines
      .slice(contentStartIndex, endIndex)
      .filter((line) => {
        return line.isHeading() && line.getContent().startsWith("Exercise");
      })
      .map((exercise, index) => {
        return exercise.modify((line) => {
          return line.replace(/Exercise \d{1,}/, `Exercise ${index + 1}`);
        });
      });

    decoratedLines
      .slice(contentStartIndex, endIndex)
      .filter((line) => {
        return line.isHeading() && line.getContent().startsWith("Solution");
      })
      .map((solution, index) => {
        return solution.modify((line) => {
          return line.replace(/Solution \d{1,}/, `Solution ${index + 1}`);
        });
      });
  }
};

for (const index in decoratedLines) {
  const numericIndex = parseInt(index);
  const currentLine = decoratedLines[numericIndex];

  ensureExercisesAndSolutionsHaveCorrectNumbers(currentLine);
}

const formattedContent = decoratedLines.map((line) => line.line).join("\n");

fs.writeFileSync(bookLocation, formattedContent);
