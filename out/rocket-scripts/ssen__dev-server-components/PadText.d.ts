/// <reference types="react" />
import { BackgroundColor, ForegroundColor } from 'chalk';
import { TextProps } from 'ink';
export interface PadTextProps extends Omit<TextProps, 'children' | 'color' | 'backgroundColor'> {
    title: string;
    children: string;
    indent?: number;
    titleWidth?: number;
    color?: typeof ForegroundColor;
    backgroundColor?: typeof BackgroundColor;
}
export declare function PadText({ title, children, indent, titleWidth, ...textProps }: PadTextProps): JSX.Element;
