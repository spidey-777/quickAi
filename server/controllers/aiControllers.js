import OpenAI from "openai";
import  sql  from "../configs/db.js"; 
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import FormData from 'form-data';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length} = req.body;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens:length|| 800,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content,type)
      VALUES (${userId}, ${prompt}, ${content},'article')
    `;

    res.status(200).json({
      success: true,
      message: "Article generated successfully",
      content,
    });
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate article",
      error: error.message,
    });
  }
};


export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt,category} = req.body;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: `Generate a catchy blog title for the topic: ${prompt} in the category of ${category}.`,
        },
      ],
      temperature: 0.7,
      maxTokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content,type)
      VALUES (${userId}, ${prompt}, ${content},'blog-title')
    `;

    res.status(200).json({
      success: true,
      message: "blog-title generated successfully",
      content,
    });
  } catch (error) {
    console.error("Error generating blog-title:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate blog-title",
      error: error.message,
    });
  }
};


export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt,style,publish} = req.body;

    const formData = new FormData();
    formData.append('prompt',prompt);
    const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
      headers:{
         ...formData.getHeaders(),
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: 'arraybuffer',
    })
    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const {secure_url}=await cloudinary.uploader.upload(base64Image)
      

    await sql`
      INSERT INTO creations (user_id, prompt, content,type,publish)
      VALUES (${userId}, ${prompt}, ${secure_url},'image',${publish ??false })
    `;

    res.status(200).json({
      success: true,
      message: "image generated successfully",
      content:secure_url,
    });
  } catch (error) {
    console.error("Error generating image:", error?.response?.data || error);
    res.status(500).json({
      success: false,
      message: "Failed to generate image",
      error: error.message,
    });
  }
};


export const backgroundRemove = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file

    const {secure_url}=await cloudinary.uploader.upload(image.path,{
      transformation:[
        {
          effect: 'background_removal',
          background_removal:'remove_the_background',

         }
      ]
    })
    await sql`
      INSERT INTO creations (user_id, prompt, content,type)
      VALUES (${userId},'remove background from the image', ${secure_url},'image')
    `;

    res.status(200).json({
      success: true,
      message: "image generated successfully",
      content:secure_url,
    });
  } catch (error) {
    console.error("Error removeing bacground:",  error);
    res.status(500).json({
      success: false,
      message: "Failed to remove background",
      error: error.message,
    });
  }
};


export const removeobject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file
    const {object} = req.body;

    const {public_id}=await cloudinary.uploader.upload(image.path)
    const image_url = cloudinary.url(public_id,{
      transformation:[
        {effect:`gen_remove:${object}`}
      ],
      resorce_type: 'image',
    })
    await sql`
      INSERT INTO creations (user_id, prompt, content,type)
      VALUES (${userId},${`Removed ${object} from image`}, ${image_url},'image')
    `;

    res.status(200).json({
      success: true,
      message: "object removed successfully",
      content:image_url,
    });
  } catch (error) {
    console.error("Error removeing obj:",  error);
    res.status(500).json({
      success: false,
      message: "Failed to remove object",
      error: error.message,
    });
  }
};


export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review this resume and provide feedback on its strengths, weaknesses, and areas of improvement.
Resume content:
${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000, // corrected key
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
    `;

    res.status(200).json({
      success: true,
      message: "Resume reviewed successfully",
      content,
    });
  } catch (error) {
    console.error("Error reviewing resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to review resume",
      error: error.message,
    });
  }
};