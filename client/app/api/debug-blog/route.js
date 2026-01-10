import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET() {
    try {
        // Fetch ALL blogs regardless of status to see what's in Sanity
        const allBlogs = await client.fetch(`*[_type == "blog"] {
            _id,
            title,
            status,
            publishDate,
            slug,
            thumbnail,
            author,
            category
        }`)

        // Fetch only published blogs (what the frontend uses)
        const publishedBlogs = await client.fetch(`*[_type == "blog" && status == "published"] {
            _id,
            title,
            status,
            publishDate,
            slug,
            thumbnail,
            author,
            category
        }`)

        return NextResponse.json({
            totalBlogs: allBlogs.length,
            publishedBlogs: publishedBlogs.length,
            allBlogs,
            publishedBlogs,
            message: 'Check the data above to debug'
        })
    } catch (error) {
        return NextResponse.json({
            error: error.message,
            details: 'Error fetching blogs from Sanity'
        }, { status: 500 })
    }
}
