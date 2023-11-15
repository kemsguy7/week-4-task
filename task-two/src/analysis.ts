import fs from 'fs';
import EmailValidator from 'email-validator';

interface AnalysisResult {
  validDomains: string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  domainOccurrences: Record<string, number>;
}

function analyseFiles(inputPaths: string[], outputPath: string) {
  const allEmails: string[] = [];
  const validEmails: string[] = [];
  const validDomains: string[] = [];
  const domainOccurrences: Record<string, number> = {};

  inputPaths.forEach((filePath) => {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const emails = fileData.split('\n').slice(1, -1); // Assuming CSV has a header and one email per line

    allEmails.push(...emails);

    emails.forEach((email) => {
      if (EmailValidator.validate(email)) {
        validEmails.push(email);
        const [, domain] = email.split('@');
        validDomains.push(domain);

        domainOccurrences[domain] = (domainOccurrences[domain] || 0) + 1;
      }
    });
  });

  const uniqueValidDomains = Array.from(new Set(validDomains));

  const result: AnalysisResult = {
    validDomains: uniqueValidDomains,
    totalEmailsParsed: allEmails.length,
    totalValidEmails: validEmails.length,
    domainOccurrences,
  };

  fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result); //outputs result to the console.
      console.log('Result saved to', outputPath);
    }
  });
}

export default analyseFiles;
