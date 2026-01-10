import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

export async function POST(request) {
    try {
        const body = await request.json()
        const { email, firstName, lastName, subscriberType } = body

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingSubscriber = await writeClient.fetch(
            `*[_type == "subscriber" && email == $email][0]`,
            { email }
        )

        if (existingSubscriber) {
            // If already subscribed
            if (existingSubscriber.status === 'subscribed') {
                return NextResponse.json(
                    { message: 'This email is already subscribed to our newsletter' },
                    { status: 400 }
                )
            }

            // If previously unsubscribed, resubscribe
            await writeClient
                .patch(existingSubscriber._id)
                .set({
                    status: 'subscribed',
                    unsubscribedDate: null,
                    firstName: firstName || existingSubscriber.firstName,
                    lastName: lastName || existingSubscriber.lastName,
                    subscriberType: subscriberType || existingSubscriber.subscriberType
                })
                .commit()

            return NextResponse.json(
                { message: 'Successfully resubscribed to newsletter' },
                { status: 200 }
            )
        }

        // Create new subscriber
        const newSubscriber = {
            _type: 'subscriber',
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            subscriberType: subscriberType || 'general',
            joinedDate: new Date().toISOString(),
            status: 'subscribed'
        }

        await writeClient.create(newSubscriber)

        return NextResponse.json(
            { message: 'Successfully subscribed to newsletter' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error subscribing to newsletter:', error)
        return NextResponse.json(
            { message: 'An error occurred while subscribing. Please try again.' },
            { status: 500 }
        )
    }
}
