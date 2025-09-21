import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
    label: {
      control: { type: 'text' },
    },
    error: {
      control: { type: 'text' },
    },
    helperText: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Password must be at least 8 characters long',
  },
}

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Enter your email',
    leftIcon: <Mail className="h-5 w-5" />,
  },
}

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Enter your password',
    rightIcon: <Eye className="h-5 w-5" />,
  },
}

export const WithBothIcons: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    leftIcon: <Lock className="h-5 w-5" />,
    rightIcon: <Eye className="h-5 w-5" />,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    label: 'Email',
    placeholder: 'example@email.com',
    leftIcon: <Mail className="h-5 w-5" />,
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    leftIcon: <Lock className="h-5 w-5" />,
    rightIcon: <Eye className="h-5 w-5" />,
  },
}
