import { Link as TanstackLink, LinkProps } from "@tanstack/react-router"
import { AnchorHTMLAttributes, forwardRef } from "react"
import { cn } from "~/helpers/cn.ts"

export interface CustomLinkProps extends LinkProps {
	/** Additional CSS classes to apply */
	className?: string
	/** Whether the link should be styled as a button */
	variant?: "default" | "button" | "primary" | "secondary"
	/** Whether the link should open in a new tab */
	external?: boolean
}

export interface ExternalLinkProps
	extends AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Additional CSS classes to apply */
	className?: string
	/** Whether the link should be styled as a button */
	variant?: "default" | "button" | "primary" | "secondary"
	/** Whether the link should open in a new tab */
	external: true
	/** The URL to link to */
	href: string
}

export const Link = forwardRef<
	HTMLAnchorElement,
	CustomLinkProps | ExternalLinkProps
>(
	(
		{ className = "", variant = "default", external = false, ...props },
		ref,
	) => {
		const baseClasses =
			"transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 underline hover:no-underline"

		const variantClasses = {
			default: "",
			button:
				"inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700",
			primary: "text-blue-600 hover:text-blue-800 font-semibold",
			secondary: "text-gray-600 hover:text-gray-800",
		}

		const combinedClassName = cn(
			baseClasses,
			variantClasses[variant],
			className,
		)

		if (external) {
			const { href, ...externalProps } = props as ExternalLinkProps
			return (
				<a
					ref={ref}
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className={combinedClassName}
					{...externalProps}
				/>
			)
		}

		return (
			<TanstackLink
				ref={ref}
				className={combinedClassName}
				{...(props as CustomLinkProps)}
			/>
		)
	},
)

Link.displayName = "Link"
