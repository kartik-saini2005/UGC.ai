import {Request, Response} from "express"
import * as Sentry from "@sentry/node" 
import { prisma } from "../configs/prisma";


//Get User Credits
export const getUserCredits = async (req: Request, res: Response) => {
     try {
        const { userId } = req.auth();
        if(!userId){ return res.status(401).json({ message: 'Unauthorized' }); }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        res.json({ credits: user?.credits });

     } catch (error:any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.code || error.message || 'Internal Server Error' });
     }
} 


//const get all user projects
export const getAllProjects = async (req: Request, res: Response) => {
     try {
        const { userId } = req.auth();
        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
        res.json({projects})
     } catch (error:any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.code || error.message || 'Internal Server Error' });
     }
} 

// get project by id
export const getProjectById = async (req: Request, res: Response) => {
     try {
        const { userId } = req.auth();
        const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId, userId },
        })

        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({project})
     } catch (error:any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.code || error.message || 'Internal Server Error' });
     }
} 

//publish / unpublish projecct 
export const toggleProjectPublic = async (req: Request, res: Response) => {
     try {
        const { userId } = req.auth();
        const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId, userId },
        })

        if(!project){
            return res.status(404).json({ message: 'Project not found' });
        }
        if (!project?.generatedImage) {
            return res.status(400).json({ message: 'Project has no generated content to publish' });
        }

        await prisma.project.update({
            where: { id: projectId, userId },
            data: { isPublic: !project.isPublished },
        })

        res.json({project: !project.isPublished})
     } catch (error:any) {
        Sentry.captureException(error)
        res.status(500).json({ message: error.code || error.message || 'Internal Server Error' });
     }
} 