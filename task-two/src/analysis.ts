import fs from 'fs';
import EmailValidator from 'email-validator';

/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
interface results {
  'valid-domains': string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  categories: Record<string, number>;
}

function analyseFiles(inputPaths: string[], outputPath: string) {
  let email = '';
  let emailArr: string[] = [];
  const trueEmailArr: string[] = [];
  const validEmailArr: string[] = [];
  const validDomainsArr: string[] = [];
  let domainNamesFreq: Record<string, number>;
  const ValidDomainsArr: string[] = [];
  inputPaths.forEach((x) => {
    fs.readFile(x, 'utf-8', (err, data) => {
      for (const mail of data) {
        email += mail;
      }
      email = email.toString();
      emailArr = email.split('\n');
      for (let i = 1; i < emailArr.length - 1; i++) {
        trueEmailArr.push(emailArr[i]);
      }

      trueEmailArr.forEach((y) => {
        if (EmailValidator.validate(y) === true) {
          validEmailArr.push(y);
        }
      });
      for (let j = 0; j < validEmailArr.length; j++) {
        const splitValid = validEmailArr[j].split('@');
        validDomainsArr.push(splitValid[1]);
      }
      domainNamesFreq = {};
      validDomainsArr.forEach((z) => {
        if (domainNamesFreq[z]) {
          domainNamesFreq[z]++;
        } else domainNamesFreq[z] = 1;
      });

      const uniqueValidDomainsArr = Array.from(
        new Set<string>(validDomainsArr),
      );

      const result: results = {
        'valid-domains': [],
        totalEmailsParsed: 0,
        totalValidEmails: 0,
        categories: {},
      };
      result['valid-domains'] = uniqueValidDomainsArr;
      result.totalEmailsParsed = trueEmailArr.length;
      result.totalValidEmails = validEmailArr.length;
      result.categories = domainNamesFreq;

      console.log(result);
      fs.writeFile(outputPath, JSON.stringify(result), 'utf-8', (err) => {
        if (err) console.log(err);
        else console.log('result saved');
      });
    });
  });
}

export default analyseFiles;
