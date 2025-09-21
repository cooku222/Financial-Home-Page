import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'
import { Button } from './Button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <CardContent>
        <p>This is a simple card with default styling.</p>
      </CardContent>
    ),
  },
}

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a header with title and description.</p>
        </CardContent>
      </>
    ),
  },
}

export const WithFooter: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card with Footer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has a footer with action buttons.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="mr-2">
            Cancel
          </Button>
          <Button>Save</Button>
        </CardFooter>
      </>
    ),
  },
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <CardContent>
        <p>This card has an elevated shadow effect.</p>
      </CardContent>
    ),
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <CardContent>
        <p>This card has a thick outlined border.</p>
      </CardContent>
    ),
  },
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <div className="p-6">
        <p>This card has no default padding.</p>
      </div>
    ),
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <div>
        <p>This card has small padding.</p>
      </div>
    ),
  },
}

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <div>
        <p>This card has large padding.</p>
      </div>
    ),
  },
}

export const Complete: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <CardTitle>Complete Card Example</CardTitle>
          <CardDescription>
            This is a complete card with all components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>This card demonstrates all the card components working together.</p>
            <p>It includes a header, content, and footer sections.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </CardFooter>
      </>
    ),
  },
}
