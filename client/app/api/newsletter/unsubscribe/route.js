import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

export async function POST(request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            )
        }

        // Find subscriber by email
        const subscriber = await writeClient.fetch(
            `*[_type == "subscriber" && email == $email][0]`,
            { email }
        )

        if (!subscriber) {
            return NextResponse.json(
                { message: 'Email not found in our subscriber list' },
                { status: 404 }
            )
        }

        if (subscriber.status === 'unsubscribed') {
            return NextResponse.json(
                { message: 'This email is already unsubscribed' },
                { status: 400 }
            )
        }

        // Update subscriber status to unsubscribed
        await writeClient
            .patch(subscriber._id)
            .set({
                status: 'unsubscribed',
                unsubscribedDate: new Date().toISOString()
            })
            .commit()

        return NextResponse.json(
            { message: 'Successfully unsubscribed from newsletter' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error)
        return NextResponse.json(
            { message: 'An error occurred while unsubscribing. Please try again.' },
            { status: 500 }
        )
    }
}
