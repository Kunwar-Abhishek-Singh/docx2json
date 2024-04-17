import React, { useState } from "react";
import JSZip from "jszip";
import { DOMParser } from "@xmldom/xmldom";
import parse from "html-react-parser";
// import classes from "./DocxReader2.module.css";
import omml2mathml from "omml2mathml";
// import MathJax from 'mathjax-full'
// import EditorComponent from "./EditorComponent";
// import xml2js from "xml-js";

let englishquestions = [];
let englishoptionA = [];
let englishoptionB = [];
let englishoptionC = [];
let englishoptionD = [];
let hindiquestions = [];
let HindioptionA = [];
let HindioptionB = [];
let HindioptionC = [];
let HindioptionD = [];
let answer = [];
let section = [{option:"section"}];
let solutions = [];
let hindisolutions = [];
let base64array = [];

// const QuestionOption = ({ label, option, images }) => {
//   // const imageToTinyMce =images.map((image, imageIndex) => (
//   //       <img
//   //         key={imageIndex}
//   //         src={image.imageUrl}
//   //         alt={`Image ${imageIndex + 1}`}
//   //         className={classes.imageFile}
//   //       />
//   //     ))

//   const generateImageTag = (image) => {
//     return `<img src="${image.imageUrl}" alt="Image" class="${classes.imageFile}" />`;
//   };

//   const getEditorContent = (option, images) => {
//     let content = option;

//     if (images && images.length > 0) {
//       images.forEach((image, index) => {
//         content += generateImageTag(image);
//       });
//     }
//     console.log(getEditorContent)
//     return content;
//   };

//   const editorContent = getEditorContent(option, images);

//   return (
//     <div>
//       {console.log("editorContent",editorContent)}
//       <EditorComponent key={option} title={label} content={editorContent} />
//     </div>
//   );
// };




let equationArray = []
const QuestionOption = ({ label, option, images }) => (
  <div>
    <p><h4> {label}</h4></p>
    {/* <p
      dangerouslySetInnerHTML={{ __html: option.replace(/\n/g, "<br />") }}
      style={{ whiteSpace: "pre-line" }}
    ></p> */}
    <p><h6>{parse(option)}</h6></p>
    {/* Display images if available */}
    {images && images.length > 0 && (
      <div>
        {/* <p></p> */}
        {images.map((image, imageIndex) => (
          <img
            key={imageIndex}
            src={image.imageUrl}
            alt={`${imageIndex + 1}`}
            
          />
        ))}
      </div>
    )}
  </div>
);
// const convertOMMLtoMathML = async (ommlData) => {
//   // Replace the following OMML with your actual OMML content
//   const ommlContent = ommlData;

//   // Retrieve the MathML from the MathJax API
//   const mathML = await window.MathJax.startup.promise.then(()=>{
//   // const mathML = await window.MathJax.startup.promise.then(() => {
//     return MathJax.typeset({
//       math: ommlContent,
//       format: 'MathML',
//       html: true,
//     });
//   });
//   console.log(mathML)
//   equationArray.push(mathML);
// }

async function processImage(imagePart, imageDataReference) {
  try {
    const base64Data = await imagePart.async("base64");
    const imageUrl = `data:image/png;base64,${base64Data}`;
    base64array.push({ reference: imageDataReference, imageUrl });
    // console.log(base64array)

  } catch (error) {
    console.error("Error reading image file:", error);
  }
}

const checkForOMathTag = (tag) => {
  // const parsedData = xml2js.xml2js(xmlData, { compact: true, spaces: 4 });

  // // Check if any <w:p> tag contains <m:oMath> tag
  // const containsOMathTag = parsedData.elements[0].elements.some((element) => {
  //   return element.elements && element.elements.some((subElement) => subElement.name === 'm:oMath');
  // });

  // return containsOMathTag;

  const hasOMathTag = tag.getElementsByTagName("m:oMath").length > 0;

  // Use the result as needed
  // console.log(`Tag ${tag.tagName} has <m:oMath> tag: ${hasOMathTag}`);

};

const processParagraphs = async (docxData) => {
  let question1Array = [];
  let mainEquationArray = [];
  let mathmlElement;
  let questionData = {
    englishQuestion: null,
    englishOptionA: null,
    englishOptionB: null,
    englishOptionC: null,
    englishOptionD: null,
    hindiQuestion: null,
    HindiOptionA: null,
    HindiOptionB: null,
    HindiOptionC: null,
    HindiOptionD: null,
    answer: null,
    EnglishSolution: null,
    hindiSolution: null,
    sections:{option:"section"}
  };
  let drawingArray = [];
  let Questions = [];
  let html_mathml_dataurl_Array = [];
  let c = 1;
  let d = 1;
  let imageDataReferenceFlag = 0;
  let imageUrlFlag = 0;
  let question1ArrayPushFlag = 0;
  let drawing = [];

  const zip = await JSZip.loadAsync(docxData);
  // console.log(zip)
  const documentXml = zip.file("word/document.xml");




  if (documentXml) {
    const documentXmlContent = await documentXml.async("text");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(
      documentXmlContent,
      "application/xml"
    );
    // console.log(documentXmlContent)
    // console.log(xmlDoc)

    // -----------------all tags extraction coding started-----------------------
    const paraAndImageXml = xmlDoc.getElementsByTagName("*");
    // console.log("paraAndImageXml")
    // console.log(paraAndImageXml)
    let arrayForxmlDoc = [];
    let DrawingArrayForXmlDoc = [];

    for (let i = 0; i < paraAndImageXml.length; i++) {
      let currentTag = paraAndImageXml[i];
      if (currentTag.tagName === "w:p") {
        // alert("starting hasoMath tag function")
        // const hasOMathTag = checkForOMathTag(currentTag);
        arrayForxmlDoc.push(paraAndImageXml[i]);
        html_mathml_dataurl_Array.push(paraAndImageXml[i]);

        const hasOMathTag =
          currentTag.getElementsByTagName("m:oMath").length > 0;
        // alert(hasOMathTag)
        // if(hasOMathTag){
        // }else{
        //   arrayForxmlDoc.push(paraAndImageXml[i]);

        // }
        // alert(hasOMathTag)
      } else if (currentTag.tagName === "w:drawing") {
        arrayForxmlDoc.push(paraAndImageXml[i]);
        html_mathml_dataurl_Array.push(paraAndImageXml[i]);
        DrawingArrayForXmlDoc.push(paraAndImageXml[i]);
      } else if (currentTag.tagName === "m:oMath") {
        let ommlData = currentTag;
        html_mathml_dataurl_Array.push(paraAndImageXml[i]);
        let trialmathmlElement = omml2mathml(ommlData)


        // console.log("trialmathmlelement")
        // console.log(trialmathmlElement);

        // alert(trialmathmlElement[0].MathMLElement.outerHTML)
        // console.log(` `+trialmathmlElement[0].MathMLElement)

        mathmlElement = trialmathmlElement.outerHTML;
        mainEquationArray.push(mathmlElement);
        arrayForxmlDoc.push(mathmlElement);
        // console.log(mathmlElement)
      }
    }
    // console.log(DrawingArrayForXmlDoc);


    // console.log("arrayforXmlDoc")
    // console.log(arrayForxmlDoc);
    // mainEquationArray.push(equationArray);
    // alert(equationVar)
    // console.log("mainEquationArray is displaying its data");
    // console.log(mainEquationArray);

    //xml to html conversion and pushing into another array
    const convertXmlToHtml = (xmlString) => {
      // Replace XML tags with corresponding HTML tags

      const htmlString = xmlString
        .replace(/<p/g, "<p")
        .replace(/<\/p>/g, "</p>")
        .replace(/<pPr>/g, "<span>")
        .replace(/<\/pPr>/g, "</span>")
        .replace(/<pStyle[^>]*w:val="([^"]*)"[^>]*>/g, '<span class="$1">')
        .replace(/<w:jc[^>]*w:val="([^"]*)"[^>]*>/g, 'style="text-align: $1;"')
        .replace(/<span[^>]*font-family: ([^;"]*);[^>]*font-weight: bold;[^>]*font-size: 20px;[^>]*>/g, '<span style="font-family: $1; font-weight: bold; font-size: 20px;">')
        .replace(/<span[^>]*font-size: 20px;[^>]*>/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<w:t[^>]*>/g, '')
        .replace(/<\/w:t>/g, '');

      return htmlString;
    };

    for (let i = 0; i < arrayForxmlDoc.length; i++) {
      let currentTag = arrayForxmlDoc[i];
      if (currentTag.tagName === "w:p") {
        // alert(currentTag);
        // let paraxml = currentTag.textContent;
        // let paraxml = currentTag;
        // alert(arrayForxmlDoc[1])
        let text = currentTag.textContent;
        // alert(paraxml)
        // question1Array.push({paraxml,text});
        let j = i;
        let text2;
        if (j < arrayForxmlDoc.length - 1) {

          text2 = html_mathml_dataurl_Array[j + 1].textContent;

        }

        const hasOMathTag = html_mathml_dataurl_Array[i].getElementsByTagName("m:oMath").length > 0;
        if (hasOMathTag) {
          // alert("found it true")
          const newTExt = text.replace(text2, arrayForxmlDoc[i + 1]);
          // console.log(newTExt);
          question1Array.push(newTExt)
        }
        else {
          // alert("found it false")
          question1Array.push(text);
        }
        // let string = JSON.stringify(currentTag);
        // const htmlString = convertXmlToHtml(string);
        // html_mathml_dataurl_Array.push(currentTag);


      } else if (currentTag.tagName === "w:drawing") {
        const drawingElement = currentTag;
        // alert(currentTag)
        const imageDataElement =
          drawingElement.getElementsByTagName("a:blip")[0];
        // console.log("imageDataElement",imageDataElement)
        const imageDataReference = imageDataElement.getAttribute("r:embed");
        // alert(imageDataReference)

        if (imageDataReferenceFlag == 1) {
          let imageUrl;
          // alert(drawingArray)
          for (let loop = 0; loop < drawingArray.length; loop++) {
            if (drawingArray[loop].reference === imageDataReference) {
              imageUrl = drawingArray[loop].imageUrl;
              question1ArrayPushFlag = 1;
            }
          }
          if (question1ArrayPushFlag == 1) {
            question1Array.push({ reference: imageDataReference, imageUrl });
            question1ArrayPushFlag = 0;
          } else {
            imageUrlFlag = 0;
          }
        }

        // Locate the image part using the reference

        const imagePartId = imageDataReference;
        if (imageUrlFlag == 0) {
          const imagePart = zip.file(`word/media/image${c}.png`); // Adjust the file extension as needed
          c++;
          if (imagePart) {
            const imageBlob = await imagePart.async("blob");

            const imageUrl = URL.createObjectURL(imageBlob);
            // ----------------data url conversion started here------------------
            // imagePart
            //   .async("base64")
            //   .then((base64Data) => {
            //     const imageUrl = `data:image/png;base64,${base64Data}`;
            //     base64array.push({ reference: imageDataReference, imageUrl });
            //   })
            //   .catch((error) => {
            //     console.error("Error reading image file:", error);
            //   });

            await processImage(imagePart, imageDataReference);

            // ------------------------aws s3 bucket adding -------------------------

            // const AWS = require("aws-sdk");

            // AWS.config.update({
            //   accessKeyId: process.env.AWS_ACCESS_KEY,
            //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            //   region: process.env.AWS_REGION,
            // });

            // const s3 = new AWS.S3();

            // const saveImageOnS3 = async (imageData, imageName) => {
            //   const uploadParams = {
            //     Bucket: "docxreader-images-v1",
            //     Key: imageName,
            //     // Body: Buffer.from(imageData, "base64"),
            //     Body: new Uint8Array(Buffer.from(imageData, 'base64')),
            //     ContentType: "image/png", // Adjust the content type based on your image type
            //     ACL: "public-read", // Set the appropriate ACL
            //   };

            //   // return s3.upload(uploadParams).promise();
            //   try {
            //     const data = await s3.upload(uploadParams).promise();
            //     console.log('File uploaded successfully:', data.Location);
            //     return data.Location; // returns the URL of the uploaded file
            //   } catch (error) {
            //     console.error('Error uploading file:', error);
            //     throw error;
            //   }
            // };

            // imagePart
            //   .async("base64")
            //   .then(async (base64Data) => {
            //     const imageName = `image${c}.png`;
            //     await saveImageOnS3(base64Data, imageName);

            //     const imageUrl = `https://docxreader-image-v1.s3.ap-south-1.amazonaws.com/${imageName}`;
            //     base64array.push({ reference: imageDataReference, imageUrl });
            //   })
            //   .catch((error) => {
            //     console.error("Error reading image file:", error);
            //   });

            //   console.log("imageUrl",imageUrl);

            // ------------------------data url conversion ended here--------------------

            drawingArray.push({ reference: imageDataReference, imageUrl });
            imageDataReferenceFlag = 1;
            question1Array.push({ reference: imageDataReference, imageUrl });
            imageUrlFlag = 1;
            // console.log(extractedImageData)
          }
        }
      }
      // else{
      //   // alert(currentTag);
      //   // alert(question1Array[question1Array.length-1] )
      //   // alert(html_mathml_dataurl_Array[i].children)
      //   question1Array.push(currentTag);

      //   // alert(question1Array[question1Array.length-1] )




      // }
    }
  }
  // console.log("html_mathml_dataurl_Array")
  // console.log(html_mathml_dataurl_Array)
  // console.log("base64array",base64array)
  // console.log("drawingArray",drawingArray)
  // console.log("question1Array", question1Array)
  let j = 0;
  for (let i = 0; i < base64array.length; i++) {
    // alert(base64array[1].reference)
    for (j = 0; j < question1Array.length; j++) {
      if (question1Array[j].reference === base64array[i].reference) {
        question1Array[j].imageUrl = base64array[i].imageUrl;
      }
    }
  }
  // console.log(base64array[2].reference);
  // console.log("after overwriting the imageUrl displaying the question1Array");
  // console.log(question1Array);
  var currentEnglishQuestion = null;
  var currentEnglishOption = null;
  let flag = 0;
  // for (var i = 0; i < question1Array.length; i++) {
  //   var element = question1Array[i];

  //   if (typeof element === "string") {
  //     if (flag == 1) {
  //       if (element.startsWith("[E]")) {
  //         Questions.push(questionData);
  //         questionData = {
  //           englishQuestion: null,
  //           englishOptionA: null,
  //           englishOptionB: null,
  //           englishOptionC: null,
  //           englishOptionD: null,
  //           hindiQuestion: null,
  //           HindiOptionA: null,
  //           HindiOptionB: null,
  //           HindiOptionC: null,
  //           HindiOptionD: null,
  //           answer: null,
  //           EnglishSolution: null,
  //           hindiSolution: null,
  //         };
  //         i--;
  //         flag = 0;
  //       } else {
  //         i--;
  //         flag = 0;
  //       }
  //       // console.log(questionData)
  //     } else if (element.startsWith("[E]")) {
  //       // If it starts with [E], it's an English option
  //       currentEnglishOption = null;

  //       currentEnglishQuestion = {
  //         option: element.replace("[E]", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("(#a)")) {
  //       questionData.englishQuestion = currentEnglishQuestion;
  //       currentEnglishQuestion = null;

  //       // If it starts with (#a), it's an English option A
  //       currentEnglishOption = {
  //         option: element.replace("(#a)", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("(#b)")) {
  //       questionData.englishOptionA = currentEnglishOption;
  //       currentEnglishOption = null;

  //       currentEnglishOption = {
  //         option: element.replace("(#b)", ""),
  //         image: [],
  //       };
  //       // englishOptions.push(currentEnglishOption);
  //     } else if (element.startsWith("(#c)")) {
  //       questionData.englishOptionB = currentEnglishOption;
  //       currentEnglishOption = null;

  //       currentEnglishOption = {
  //         option: element.replace("(#c)", ""),
  //         image: [],
  //       };
  //       // englishOptions.push(currentEnglishOption);
  //     } else if (element.startsWith("(#d)")) {
  //       questionData.englishOptionC = currentEnglishOption;
  //       currentEnglishOption = null;

  //       currentEnglishOption = {
  //         option: element.replace("(#d)", ""),
  //         image: [],
  //       };
  //       // englishOptions.push(currentEnglishOption);
  //     } else if (element.startsWith("[H]")) {
  //       questionData.englishOptionD = currentEnglishOption;
  //       currentEnglishOption = null;
  //       currentEnglishQuestion = {
  //         option: element.replace("[H]", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("(ha)")) {
  //       questionData.hindiQuestion = currentEnglishQuestion;
  //       currentEnglishQuestion = null;
  //       currentEnglishOption = {
  //         option: element.replace("(ha)", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("(hb)")) {
  //       questionData.HindiOptionA = currentEnglishOption;
  //       currentEnglishOption = null;
  //       currentEnglishOption = {
  //         option: element.replace("(hb)", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("(hc)")) {
  //       questionData.HindiOptionB = currentEnglishOption;
  //       currentEnglishOption = null;
  //       currentEnglishOption = {
  //         option: element.replace("(hc)", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("(hd)")) {
  //       questionData.HindiOptionC = currentEnglishOption;
  //       currentEnglishOption = null;
  //       currentEnglishOption = {
  //         option: element.replace("(hd)", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("[ans]")) {
  //       questionData.HindiOptionD = currentEnglishOption;
  //       currentEnglishOption = null;
  //       currentEnglishOption = {
  //         option: element.replace("[ans]", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("[Sol]")) {
  //       questionData.answer = currentEnglishOption;
  //       currentEnglishOption = null;
  //       currentEnglishOption = {
  //         option: element.replace("[Sol]", ""),
  //         image: [],
  //       };
  //     } else if (element.startsWith("[HSol]")) {
  //       questionData.EnglishSolution = currentEnglishOption;
  //       currentEnglishOption = null;
  //       currentEnglishOption = {
  //         option: element.replace("[HSol]", ""),
  //         image: [],
  //       };
  //       questionData.hindiSolution = currentEnglishOption;

  //       flag = 1;
  //     } else {
  //       // console.log("enter into else for multiline")
  //       if (currentEnglishQuestion) {
  //         currentEnglishQuestion.option += "<br />" + element;
  //       } else if (currentEnglishOption) {
  //         currentEnglishOption.option += "<br /> " + element;
  //         flag = 1;
  //       }
  //     }
  //   } else if (element && element.reference && currentEnglishQuestion) {
  //     // If it's an object with a reference and there's a current English option
  //     currentEnglishQuestion.image.push(element);
  //   } else if (element && element.reference && currentEnglishOption) {
  //     // If it's an object with a reference and there's a current English option
  //     currentEnglishOption.image.push(element);
  //     flag = 1;
  //   }
  // }
  
  let count = 1;
  let englishQuestionArray = []

  for (var i = 0; i < question1Array.length; i++) {
    var element = question1Array[i];

    if (typeof element === "string") {
      if (flag === 12) {
        if (element.startsWith("[E]")) {
          currentEnglishOption = { option: "----empty----", image: [] }
          currentEnglishQuestion = { option: "----empty----", image: [] }

          // if (!questionData.englishQuestion.option) {
          //   questionData.englishQuestion = currentEnglishQuestion
          //   console.log("everything is fine 1")
          // }
          // else if (!questionData.hindiQuestion.option) {
          //   questionData.hindiQuestion = currentEnglishQuestion
          //   console.log("everything is fine 2")
          // }
          // else if (!questionData.englishOptionA.option) {
          //   questionData.englishOptionA = currentEnglishOption
          //   console.log("everything is fine 3")
          // }
          // else if (!questionData.englishOptionB.option) {
          //   questionData.englishOptionB = currentEnglishOption
          //   console.log("everything is fine 4")
          // }
          // else if (!questionData.englishOptionC.option) {
          //   questionData.englishOptionC = currentEnglishOption
          //   console.log("everything is fine 5")
          // }
          // else if (!questionData.englishOptionD.option) {
          //   questionData.englishOptionD = currentEnglishOption
          //   console.log("everything is fine 6")
          // }
          // else if (!questionData.HindiOptionA.option) {
          //   questionData.HindiOptionA.option = currentEnglishOption
          //   console.log("everything is fine 7")
          // }
          // else if (!questionData.HindiOptionB.option) {
          //   questionData.HindiOptionB.option = currentEnglishOption
          //   console.log("everything is fine 8")
          // }
          // else if (!questionData.HindiOptionC.option) {
          //   questionData.HindiOptionC.option = currentEnglishOption
          //   console.log("everything is fine 9")
          // }
          // else if (!questionData.HindiOptionD.option) {
          //   questionData.HindiOptionD.option = currentEnglishOption
          //   console.log("everything is fine 10")
          // }
          // else if (!questionData.answer.option) {
          //   questionData.answer.option = currentEnglishOption
          //   console.log("everything is fine 11")
          // }

          Questions.push(questionData);
          questionData = {
            englishQuestion: { option: "----empty----", image: [] },
            englishOptionA: { option: "----empty----", image: [] },
            englishOptionB: { option: "----empty----", image: [] },
            englishOptionC: { option: "----empty----", image: [] },
            englishOptionD: { option: "----empty----", image: [] },
            hindiQuestion: { option: "----empty----", image: [] },
            HindiOptionA: { option: "----empty----", image: [] },
            HindiOptionB: { option: "----empty----", image: [] },
            HindiOptionC: { option: "----empty----", image: [] },
            HindiOptionD: { option: "----empty----", image: [] },
            answer: { option: "----empty----", image: [] },
            EnglishSolution: { option: "----empty----", image: [] },
            hindiSolution: { option: "----empty----", image: [] },
          };
          i--;
          flag = 0;
        }
        else if (element.startsWith("[End]")) {
          Questions.push(questionData);

          break;
        }
        else {
          i--;
          flag = 0;
        }
        // console.log(questionData)
      } else if (element.includes("[E]")) {
        // If it starts with [E], it's an English question
        // alert("[E] tag identifiied = "+ count)
        // alert(element);
        // count++;
        // console.log(element)
        if (flag == 1) {
          Questions.push(questionData);
          questionData = {
            englishQuestion: { option: "----empty----", image: [] },
            englishOptionA: { option: "----empty----", image: [] },
            englishOptionB: { option: "----empty----", image: [] },
            englishOptionC: { option: "----empty----", image: [] },
            englishOptionD: { option: "----empty----", image: [] },
            hindiQuestion: { option: "----empty----", image: [] },
            HindiOptionA: { option: "----empty----", image: [] },
            HindiOptionB: { option: "----empty----", image: [] },
            HindiOptionC: { option: "----empty----", image: [] },
            HindiOptionD: { option: "----empty----", image: [] },
            answer: { option: "----empty----", image: [] },
            EnglishSolution: { option: "----empty----", image: [] },
            hindiSolution: { option: "----empty----", image: [] },
            sections:{option:"section"}
          };
          flag = 0;
        }
        currentEnglishOption = null;
        englishQuestionArray.push(element.replace("[E]", ""))
        currentEnglishQuestion = {
          option: element.replace("[E]", "Q."),
          image: [],
        };
        flag = 1;
      } else if (element.includes("(#a)")) {
        // console.log(element)

        questionData.englishQuestion = currentEnglishQuestion;
        currentEnglishQuestion = null;

        // If it starts with (#a), it's an English option A
        englishQuestionArray.push(element)

        currentEnglishOption = {
          option: element.replace("(#a)", "(a)"),
          image: [],
        };
        flag = 1;
      } else if (element.includes("(#b)")) {
        // console.log(element)

        questionData.englishOptionA = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("(#b)", "(b)"),
          image: [],
        };
        flag = 1;
        // englishOptions.push(currentEnglishOption);
      } else if (element.includes("(#c)")) {
        // console.log(element)

        questionData.englishOptionB = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("(#c)", "(c)"),
          image: [],
        };
        flag = 1;
        // englishOptions.push(currentEnglishOption);
      } else if (element.includes("(#d)")) {
        // console.log(element)


        questionData.englishOptionC = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("(#d)", "(d)"),
          image: [],
        };
        flag = 1;
        // englishOptions.push(currentEnglishOption);
      } else if (element.includes("[H]")) {
        // console.log(element)


        questionData.englishOptionD = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishQuestion = {
          option: element.replace("[H]", "Q."),
          image: [],
        };
        flag = 1;
      } else if (element.includes("(ha)")) {
        // console.log(element)

        questionData.hindiQuestion = currentEnglishQuestion;
        currentEnglishQuestion = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("(ha)", "(a)"),
          image: [],
        };
        flag = 1;
      } else if (element.includes("(hb)")) {
        // console.log(element)

        questionData.HindiOptionA = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("(hb)", "(b)"),
          image: [],
        };
        flag = 1;
      } else if (element.includes("(hc)")) {
        // console.log(element)

        questionData.HindiOptionB = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("(hc)", "(c)"),
          image: [],
        };
        flag = 1;
      } else if (element.includes("(hd)")) {
        // console.log(element)

        questionData.HindiOptionC = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("(hd)", "(d)"),
          image: [],
        };
        flag = 1;
      } else if (element.includes("[ans]")) {
        // console.log(element)

        questionData.HindiOptionD = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("[ans]", " "),
          image: [],
        };
        flag = 1;
      } else if (element.includes("[Sol]")) {
        // console.log(element)

        questionData.answer = currentEnglishOption;
        currentEnglishOption = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("[Sol]", " "),
          image: [],
        };
        flag = 1;
      } else if (element.includes("[HSol]")) {
        // console.log(element)

        questionData.EnglishSolution = currentEnglishOption;
        // currentEnglishQuestion = null;
        englishQuestionArray.push(element)
        currentEnglishOption = {
          option: element.replace("[HSol]", " "),
          image: [],
        };
        questionData.hindiSolution = currentEnglishOption;

        flag = 1;
      }
      else if (element.includes("[End]")) {
        Questions.push(questionData);

        break;
      }


      else {
        // console.log("enter into else for multiline")
        if (currentEnglishQuestion) {
          englishQuestionArray.push(element)
          if(element!=""){
            currentEnglishQuestion.option += "<br />" + element;
            flag = 1;
          }
          
        } else if (currentEnglishOption) {
          englishQuestionArray.push(element)
          if(element!=""){
            currentEnglishOption.option += "<br />" + element;
            flag = 1;
          }
          
        }
      }
    } else if (element && element.reference && currentEnglishQuestion) {
      // If it's an object with a reference and there's a current English question
      englishQuestionArray.push(element)

      currentEnglishQuestion.image.push(element);
      flag = 1;
    } else if (element && element.reference && currentEnglishOption) {
      // If it's an object with a reference and there's a current English option
      englishQuestionArray.push(element)

      currentEnglishOption.image.push(element);
      flag = 1;
    }
  }








  // console.log(question1Array);
  console.log(Questions);
  // console.log(englishQuestionArray)
  // 

  for (j = 0; j < Questions.length; j++) {
    englishquestions.push(Questions[j].englishQuestion);
    englishoptionA.push(Questions[j].englishOptionA);
    englishoptionB.push(Questions[j].englishOptionB);
    englishoptionC.push(Questions[j].englishOptionC);
    englishoptionD.push(Questions[j].englishOptionD);
    hindiquestions.push(Questions[j].hindiQuestion);
    HindioptionA.push(Questions[j].HindiOptionA);
    HindioptionB.push(Questions[j].HindiOptionB);
    HindioptionC.push(Questions[j].HindiOptionC);
    HindioptionD.push(Questions[j].HindiOptionD);
    answer.push(Questions[j].answer);
    section.push(Questions[j].sections);
    solutions.push(Questions[j].EnglishSolution);
    hindisolutions.push(Questions[j].hindiSolution);

  }
  console.log(Questions)
  return {
    Questions,
    englishquestions,
    englishoptionA,
    englishoptionB,
    englishoptionC,
    englishoptionD,
    hindiquestions,
    HindioptionA,
    HindioptionB,
    HindioptionC,
    HindioptionD,
    answer,
    section,
    solutions,
    hindisolutions,
    mainEquationArray,
    mathmlElement,
  };
};

const DocxReader = ({ onProcessedData }) => {
  const [DocQuestions, setDocQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [editorContent, setEditorContent] = useState("");
  const [equationVar, setEquationVar] = useState();
  const [mathml, setMathMl] = useState([]);
  const onFileUpload = async (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = async (e) => {
      try {
        console.log(e.target)
        const docxData = e.target.result;
        const processedData = await processParagraphs(docxData);
        const { Questions, mathmlElement, mainEquationArray } = processedData;

        setDocQuestions(Questions);
        setEquationVar(mathmlElement);
        setMathMl(mainEquationArray);
        // Call the callback with the processed data
        onProcessedData(processedData);
        // setEditorContent(
        //   processedData.Questions[currentIndex].englishQuestion.option
        // );

        // setImgArray(drawingArray);
        // onProcessedData(processedData);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    reader.onerror = (err) => console.error(err);

    reader.readAsArrayBuffer(file);
    // reader.readAsDataURL(file);
  };

  // console.log(DocQuestions);
  // console.log(imgArray)
  // alert(equationVar);

  const handleNext = () => {
    if (currentIndex < DocQuestions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // function numericToAlphabetic(index) {
  //   if (index >= 5) {
  //     return String.fromCharCode("a".charCodeAt(0) + (index - 6));
  //     // const label = `(${String.fromCharCode(97 + index)})  `;
  //   } else {
  //     const alphabet = " abcdefghijklmnopqrstuvwxyz";
  //     const base = alphabet.length;

  //     let result = "";
  //     while (index >= 0) {
  //       result = alphabet[index % base] + result;
  //       index = Math.floor(index / base) - 1;
  //     }

  //     return result || "A";
  //   }

  //   // while (index >= 0) {
  //   //   result = alphabet[index % base];
  //   //   index = Math.floor(index / base) - 1;
  //   // }

  //   // return result || "A";
  // }

  const currentQuestion = DocQuestions[currentIndex];

  if (!currentQuestion) {
    return (
      <div>
        {/* <p>No questions to display.</p> */}
        <input type="file" onChange={onFileUpload} name="docx-reader" />
      </div>
    );
  }
  const handleDownload = () => {
    // Convert the array object to a JSON string
    const fileData = JSON.stringify(DocQuestions, null, 2);  // You can use 4 for more indented formatting
    const blob = new Blob([fileData], { type: 'application/json' });

    // Create a link element, use it to download the file and remove it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "JSON File";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
  
 console.log("abhishek data")
 console.log(DocQuestions)
  return (
    <>

<div className="main_div_section">
    
    <div>

      {/* <div dangerouslySetInnerHTML={{ __html: string }} /> */}
      {/* <div>{parse(sample2)}</div> */}
      {DocQuestions?
      
    
      <div className="question_showing_section border border-3">
        {/* Display English option */}
        {Object.keys(currentQuestion).map((key, index) => {
          if (key.startsWith("englishQuestion")) {
            return (
              <QuestionOption
                key={key}
                label={`English Question`}
                option={currentQuestion.englishQuestion.option}
                images={currentQuestion.englishQuestion.image}
              />
            );
          } else if (key.startsWith("englishOption")) {
            {
              /* Display English Options */
            }
            // const label = `(${numericToAlphabetic(index)})  `;
            return (
              <QuestionOption
                key={key}
                // label="English Question"
                option={currentQuestion[key].option}
                images={currentQuestion[key].image}
              />
            );
          } else if (key.startsWith("hindiQuestion")) {
            {
              /* Display Hindi option */
            }
            return (
              <QuestionOption
                key={key}
                label="Hindi Question"
                option={currentQuestion.hindiQuestion.option}
                images={currentQuestion.hindiQuestion.image}
              />
            );
          } else if (key.startsWith("HindiOption")) {
            {
              /* Display Hindi Options */
            }
            // const label = `(${String.fromCharCode(97 + index)})  `;
            // const label = `(${numericToAlphabetic(index)})  `;
            return (
              <QuestionOption
                key={key}
                // label={label}
                option={currentQuestion[key].option}
                images={currentQuestion[key].image}
              />
            );
          } else if (key.startsWith("answer")) {
            {
              /* Display Answer */
            }
            return (
              <QuestionOption
                key={key}
                label="Answer"
                option={currentQuestion.answer.option}
                images={currentQuestion.answer.image}
              />
            );
          } else if (key.startsWith("EnglishSolution")) {
            {
              /* Display English Solution */
            }
            return (
              <QuestionOption
                key={key}
                label="English Solution"
                option={currentQuestion.EnglishSolution.option}
                images={currentQuestion.EnglishSolution.image}
              />
            );
          } else if (key.startsWith("hindiSolution")) {
            {
              /* Display Hindi Solution */
            }
            return (
              <QuestionOption
                key={key}
                label="Hindi Solution"
                option={currentQuestion.hindiSolution.option}
                images={currentQuestion.hindiSolution.image}
              />
            );
          }
          return null;
        })}
        
      </div>
      :
      <input type="file" onChange={onFileUpload} name="docx-reader" />

    }
    <div className="prev_next_btn">{/* Navigation buttons */}
        <button onClick={handlePrevious} disabled={currentIndex === 0} className="btn btn-primary m-2">
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === DocQuestions.length - 1}
          className="btn btn-primary m-2"
        >
          Next
        </button></div>
    </div>
    <div className="download_json_file_btn"> <button onClick={handleDownload} className="btn btn-success m-2">Download JSON File</button></div>
    </div>
    </>
  );
};

export default DocxReader;








