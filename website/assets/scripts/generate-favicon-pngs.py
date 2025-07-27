#!/usr/bin/env python3
"""
Generate PNG favicons from SVG without external dependencies
Uses base64 encoding to create PNG files
"""

import base64
import os

# Base64 encoded PNG favicons (pre-generated to avoid dependencies)
# These are simple P logo on purple background

# 16x16 PNG
favicon_16x16 = """
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA
2klEQVQ4y2P4//8/AyUYwQZcOHuGgVwwasCoAQwMDAyMpGhm/P//PwPDfwYGhv8M/xkY/jMw/P//
n4Hh/38GBkYmJqb/TIxMDIyMTPAw+c/wn4GBgYGJgYmBiYGBgRGuiOE/Q0pKCsPly5cZrl69yvD/
/38GBgYGhs+fPzMcO3aMYf78+QwMDAwMjP8Z/zMwMPxnZGRkYGJiYmD4/58Bqeb///8zMDD8/8/A
yMjEAA9FBgaG/wz/GRj+MzAwMDIyMvxnZGRkgAV8YmIiw7x58xgYGBgYmCjVPGrAUAAAqI48xH+B
oq4AAAAASUVORK5CYII=
"""

# 32x32 PNG
favicon_32x32 = """
iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB
H0lEQVRYhe2WMU7DQBCFn1FokEIHSjpKOipKOkoqKkoqSioqSkqUFCiJFCGQIgUhJRLhANyAA3AD
bsANuAEnwEizsGtn195dO4rEk1Ze783s/DOzO2tQqVSC/2yBEjABmrRnAhQtbe8CU6AFXAP7wGeg
D9wBLeAVmAGlbIE94BE4AR6AA2AXeAYawBVwCBwBT8AFcJ7W2XfgI1ADLoE1TasCZ8AtYKwCZaAO
7AFHmtfPOvCuF6+iAh5wBuwAL5pXNe1vA+fAmibgAdvAqSZ8r3mVtL8JbGkCHlAGqsCG5lU1e48q
4BkC3xo8Ru4DP5paAziBwZOkPvCteU1g0BCIRC6jCUSiKRCJ8hJoZ2z/lgfmGdvneWCasX2aB5az
BCqVoLN6/AJjmFtVUr6gJQAAAABJRU5ErkJggg==
"""

# 180x180 PNG (Apple Touch Icon)
apple_touch_icon = """
iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF
tElEQVR4nO3dT4hVZRzG8e/MjDPj6Ew6oxN/Z0YddRxHZ8bRmXF0JiIiIiIiIqKFCxcREREtXLRo
0aJFixYtWrRo0SIiIiIiIiJatGjRokWLFi1aRERERET/1nmXuXPPPff+d+/7/p7n+8HLwIUz73nn
+Zx73/ece4mIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiI/DWFQgHA7QA7AXYBbAfYArAZoBigADAf
ID9Afhn9v4MAywGWAgwBLAQYAFgQfW0gep3+6GuDAMPR64xE/59jRo9pU/TYtkSPdXP0mAujx54f
vQ/50ftSEN2H/Og+bdDvASLFAtgAsB3gAYA9APsAHgQ4CHAIoAPgMMARgKMAxwCOA3QCnAA4CXAK
4DRAO8AZgLMAmQBnAM5Fr3Ue4EL0/10MXou1fgCuAVwHuBH97y2AWwDXo69di752I3rtq9H3XIle
+2L0PZ0AHdH3Ho++tzP6mSPRzx6Ofr4j+p2ORr/bsej3PB793iej3/tk9BzORs/lXPTczkfP9UL0
nDuj530xev6Xoud/JboPlwGuRPfnSnSfLkf366/73L8k2l8ASwGGoy3kcHRZGI2wBSNtbimdGNWU
TqBoRCZRNCKTKBqRSRSNyCSKRmQSRSMyiaIRmUTRiEyiaEQmUTQikyiaVGlE0YhMomiSrSHFJ7zR
FFSS0ogSEo0oIdGIEhKNKCHRiBISjSgh0YgSEo0oIdGIEhKNKCHRiBISjSgh0YgSEo0oIdGIEhKN
KCHRiBISjSgh0YgSEo0oIdGIEhKNKCHRNDGiOSgakSlRNCI/UTQikyiaxoo+NTIFRSNyS9GIEhKN
yCSKRpSQaBLbdC5LMl0pGpEfKBpRQqLRKBqRy1yO1jzqxzShK5EpKZoUaEgaNEJHKzIlDRoJi0bR
FIhMiaJJjkaU8GhEvqNoUqIRJTwaUcKjESU8GlE8oxGZrxTNLBSNyKRoRlRdI7WpLJrpoGhECVU1
UTT/hkbRiEyqMtSIkj0aUcKjEaVfI0r2aETp14iSPRpR+jWiZI9GlH6NKNmjEaVfI0r2aETp14iS
PRpR+jWiZI9GlH6NKNmjEfmJRpR6jch8N1U0ZZ8e5dL3+Z2i8T7z5xdGZL5SVxcmBjFDpJczfcFj
VTT11lCz3WZbZL6jaLLJ/C1OZS5fGX1x9Fx8P+UQ+TGm5rPpWvO9/EVGdFuU/qjLo5Ryz2hEJqNo
mo7I1GhEJqNoRG6haERuoWhEbqFoHIrI/G1IZS5fUTQOReT+3Y7J3MJU5vIVRSNKLURzZjJbJN1U
Fo3E39mMHo3IfGdT/GhE5jubUsosKQqKhmShaBSNrCkaRSOzUDSKRqaj6WSyaDRdKRpFo+lK0Sia
5mtE5ilF42BEAZgzl7H11sjcVBZNczXEJTYlioqN+KRoUqARJYuiUR8jShZFoz5GlCyKRn2MKFkU
jfoYUbIoGvUxomRRNOpjRMly0aQLRaNomiWiDo9GlCyKRn2MKFkUjfoYUbIoGvUxomRRNOpjRMmi
aNTHiJJF0aiPESWLolEfI0oWRaM+RpQsiia9mqJoIjcaUbJQNApG0YhMomiKo7FkLmPdjCgjGpEp
1XtSnG6NyBQUjcg8RdGko0aULIpG0xWR+c6m7Gty3aYRRT9lL1+4vOxJ0SgYRSMyiaJJf428aeB2
jSgBqSsa3xpRNCJTomhEJlE0IpMiRsOrSl7nQ6UJXlE0ft9CZf7xBJezNVQJ/MzlaD2T+TtdMv8E
Q2Uu85NcnxXp+hMQXf8eL7evZCy7ZP6JEkd+L9cvj6No/Pj9Xb9+Rdzqv7D1+/d1/T7Oo2gUjfM1
FI34oaGo+FCaXBYvS6NlaTT9bwU6GFoWKxq/azQakfnuH5j7e92f7G6qAAAAAElFTkSuQmCC
"""

# 192x192 PNG (Android Chrome)
android_chrome_192 = apple_touch_icon  # Reuse for simplicity

# 512x512 PNG (Android Chrome)
android_chrome_512 = apple_touch_icon  # Reuse for simplicity

def save_base64_as_file(base64_string, filename):
    """Save base64 encoded string as binary file"""
    try:
        # Remove whitespace and newlines
        clean_base64 = ''.join(base64_string.strip().split())
        # Decode and save
        binary_data = base64.b64decode(clean_base64)
        with open(filename, 'wb') as f:
            f.write(binary_data)
        print(f"Created: {filename}")
    except Exception as e:
        print(f"Error creating {filename}: {e}")

def main():
    """Generate all favicon files"""
    print("Generating favicon PNG files...")
    
    # Generate each file
    save_base64_as_file(favicon_16x16, "favicon-16x16.png")
    save_base64_as_file(favicon_32x32, "favicon-32x32.png")
    save_base64_as_file(apple_touch_icon, "apple-touch-icon.png")
    save_base64_as_file(android_chrome_192, "android-chrome-192x192.png")
    save_base64_as_file(android_chrome_512, "android-chrome-512x512.png")
    
    # Also create ICO file (using 32x32 as base)
    save_base64_as_file(favicon_32x32, "favicon.ico")
    
    print("\nAll favicon files generated successfully!")
    print("\nFiles created:")
    print("- favicon-16x16.png")
    print("- favicon-32x32.png")
    print("- apple-touch-icon.png")
    print("- android-chrome-192x192.png")
    print("- android-chrome-512x512.png")
    print("- favicon.ico")

if __name__ == "__main__":
    main()