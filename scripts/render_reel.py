#!/usr/bin/env python3
"""
Video-Shotcraft MP4 Reel Generator for Deccan Heritage Map
Generates a 30-second 1080x1920 30fps vertical video with synthesized sound design
following Vincentwei1021/video-shotcraft promo-energy-arc rules.
"""

import os
import sys
import math
import wave
import struct
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

WIDTH = 1080
HEIGHT = 1920
FPS = 30
TOTAL_SEC = 30.0
TOTAL_FRAMES = int(TOTAL_SEC * FPS) # 900 frames

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_MP4 = os.path.join(ROOT_DIR, "public", "deccan-heritage-reel.mp4")
AUDIO_WAV = os.path.join(ROOT_DIR, "public", "reel-audio.wav")

# Colors
CREAM = (250, 246, 238)
CREAM_DARK = (241, 229, 209)
INK = (43, 33, 25)
INK_MUTED = (109, 95, 82)
MADDER = (139, 58, 26)
TERRACOTTA = (168, 68, 31)
GOLD = (232, 200, 139)
GOLD_TEXT = (252, 211, 77)
BORDER_COLOR = (221, 208, 184)
GREEN_ACCENT = (5, 150, 105)

# System fonts
SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SERIF_REG = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SANS_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
SANS_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

font_title_lg = get_font(SERIF_BOLD, 74)
font_title_md = get_font(SERIF_BOLD, 54)
font_title_sm = get_font(SERIF_BOLD, 42)
font_subhead = get_font(SANS_BOLD, 30)
font_body = get_font(SANS_REG, 28)
font_caption = get_font(SANS_REG, 26)
font_badge = get_font(SANS_BOLD, 24)

# ---------------------------------------------------------------------------
# Audio Synthesis (Procedural 44.1kHz Stereo WAV)
# ---------------------------------------------------------------------------
def generate_audio():
    print("Synthesizing audio track with procedural sound design...")
    sample_rate = 44100
    total_samples = int(TOTAL_SEC * sample_rate)
    samples_left = [0.0] * total_samples
    samples_right = [0.0] * total_samples

    def add_tone(freq, start_sec, dur_sec, vol=0.2, decay=True):
        start_idx = int(start_sec * sample_rate)
        n = int(dur_sec * sample_rate)
        for i in range(n):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / sample_rate
            env = math.exp(-3.5 * (t / dur_sec)) if decay else (1.0 - t/dur_sec)
            val = math.sin(2.0 * math.pi * freq * t) * vol * env
            samples_left[idx] += val
            samples_right[idx] += val

    def add_drone(freq, start_sec, dur_sec, vol=0.04):
        start_idx = int(start_sec * sample_rate)
        n = int(dur_sec * sample_rate)
        for i in range(n):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / sample_rate
            val = (math.sin(2.0 * math.pi * freq * t) + 0.3 * math.sin(4.0 * math.pi * freq * t)) * vol
            samples_left[idx] += val
            samples_right[idx] += val

    # Background ambient warm drone
    add_drone(110.0, 0.0, 30.0, 0.03)
    add_drone(164.81, 0.0, 30.0, 0.02) # E3
    add_drone(220.0, 4.0, 26.0, 0.02)  # A3

    # Shot 01: Ink stamp impact (0.3s)
    for f, d, v in [(140, 0.45, 0.35), (90, 0.5, 0.4), (55, 0.6, 0.45)]:
        add_tone(f, 0.3, d, v)

    # Shot 02: Hero riser & compass click (4.0s - 4.6s)
    add_tone(330, 4.0, 0.4, 0.15)
    add_tone(440, 4.15, 0.5, 0.18)
    add_tone(554.37, 4.3, 0.6, 0.22)
    add_tone(659.25, 4.45, 0.8, 0.25)

    # Shot 03: Rapid card snap whooshes (8.5s, 8.7s, 8.9s)
    for t_off in [8.5, 8.72, 8.95]:
        for f in [600, 850, 1100]:
            add_tone(f, t_off, 0.1, 0.18)

    # Shot 04: Tibetan singing bowl chime (13.0s)
    for f in [523.25, 783.99, 1046.5, 1318.5]:
        add_tone(f, 13.0, 1.8, 0.2)

    # Shot 05: Bazaar chai & bangle harmonics (15.0s - 18.0s)
    for t_b in [15.2, 16.0, 17.1]:
        add_tone(2093, t_b, 0.3, 0.12)
        add_tone(2637, t_b + 0.05, 0.35, 0.14)
        add_tone(3135, t_b + 0.1, 0.4, 0.1)

    # Shot 06: Clock tick + radio sweep + brass tumbler lock (19.0s - 22.0s)
    for i in range(4):
        add_tone(1200 - i * 150, 19.1 + i * 0.25, 0.05, 0.2)
    # Gold Basra pearl chime
    for f in [880, 1108, 1320, 1760]:
        add_tone(f, 21.0, 1.2, 0.18)

    # Shot 07: Celebratory climax gong & festive chime (24.0s)
    add_tone(110, 24.0, 2.8, 0.4)
    add_tone(73.42, 24.0, 3.2, 0.35)
    for f in [523.25, 659.25, 783.99, 1046.5, 1318.5]:
        add_tone(f, 24.05, 2.0, 0.2)

    # Write WAV
    with wave.open(AUDIO_WAV, "w") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        raw_bytes = bytearray()
        for i in range(total_samples):
            # Clamp
            l = max(-1.0, min(1.0, samples_left[i]))
            r = max(-1.0, min(1.0, samples_right[i]))
            raw_bytes.extend(struct.pack("<hh", int(l * 32767), int(r * 32767)))
        wf.writeframes(raw_bytes)
    print(f"Audio track saved to {AUDIO_WAV}")

# ---------------------------------------------------------------------------
# Image Preloading
# ---------------------------------------------------------------------------
print("Loading photographic and illustrated assets...")
img_charminar = Image.open(os.path.join(ROOT_DIR, "public", "photos", "charminar.jpg")).convert("RGB")
img_gachibowli = Image.open(os.path.join(ROOT_DIR, "public", "photos", "gachibowli-stepwell.jpg")).convert("RGB")
img_premamati = Image.open(os.path.join(ROOT_DIR, "public", "photos", "premamati-mosque.jpg")).convert("RGB")
img_residency = Image.open(os.path.join(ROOT_DIR, "public", "photos", "british-residency.jpg")).convert("RGB")

img_square = Image.open(os.path.join(ROOT_DIR, "public", "charminar", "evening-bazaar.png")).convert("RGB")
img_lane = Image.open(os.path.join(ROOT_DIR, "public", "charminar", "bangle-lane.png")).convert("RGB")
img_courtyard = Image.open(os.path.join(ROOT_DIR, "public", "charminar", "hidden-courtyard.png")).convert("RGB")

def fit_crop(img, tw, th):
    return ImageOps.fit(img, (tw, th), method=Image.Resampling.LANCZOS)

def rounded_card(img, radius=24):
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), img.size], radius=radius, fill=255)
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, (0, 0), mask=mask)
    return out

# ---------------------------------------------------------------------------
# Shot Renderers
# ---------------------------------------------------------------------------
def draw_subtitles(draw, text):
    # Bottom subtitle banner
    box_h = 100
    y0 = HEIGHT - box_h - 60
    draw.rounded_rectangle([(80, y0), (WIDTH - 80, y0 + box_h)], radius=20, fill=(27, 20, 15, 235), outline=(139, 58, 26, 180), width=2)
    # Centered text
    full_text = f"VO: {text}"
    bbox = draw.textbbox((0, 0), full_text, font=font_caption)
    tw = bbox[2] - bbox[0]
    tx = (WIDTH - tw) // 2
    ty = y0 + (box_h - (bbox[3] - bbox[1])) // 2 - 2
    draw.text((tx, ty), full_text, font=font_caption, fill=(250, 246, 238, 255))

def draw_top_pill(draw, text):
    bbox = draw.textbbox((0, 0), text, font=font_badge)
    tw = bbox[2] - bbox[0]
    px = 30
    py = 12
    x0 = (WIDTH - tw) // 2 - px
    y0 = 90
    draw.rounded_rectangle([(x0, y0), (x0 + tw + px * 2, y0 + (bbox[3] - bbox[1]) + py * 2)], radius=24, fill=(43, 33, 25, 25), outline=(139, 58, 26, 120), width=2)
    draw.text((x0 + px, y0 + py), text, font=font_badge, fill=MADDER)

def render_shot_01(frame_idx, p):
    # brand-ink-open (0 - 4s)
    im = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(im, "RGBA")

    # Compass circles
    angle = p * 45.0
    rad = 420
    cx, cy = WIDTH // 2, 780
    draw.ellipse([(cx - rad, cy - rad), (cx + rad, cy + rad)], outline=(139, 58, 26, 45), width=3)
    draw.ellipse([(cx - rad + 30, cy - rad + 30), (cx + rad - 30, cy + rad - 30)], outline=(139, 58, 26, 30), width=2)

    # Stamp drop scale
    scale = 1.0 + max(0.0, 1.0 - p * 3.5) * 0.45
    alpha = min(int(p * 3.0 * 255), 255)

    # Logo Text
    title_text = "HYDERABAD"
    sub_text = "400 YEARS OF SECRETS"
    tag_text = "The Interactive Living Heritage Atlas of the Deccan"

    # Draw Archival Seal Emblem (Vector Arch)
    draw.rectangle([(cx - 70, cy - 250), (cx + 70, cy - 170)], fill=MADDER)
    draw.pieslice([(cx - 70, cy - 320), (cx + 70, cy - 180)], 180, 360, fill=MADDER)
    draw.rounded_rectangle([(cx - 35, cy - 230), (cx + 35, cy - 170)], radius=18, fill=CREAM)
    
    bbox1 = draw.textbbox((0, 0), title_text, font=font_title_lg)
    w1 = bbox1[2] - bbox1[0]
    draw.text((cx - w1 // 2, cy - 80), title_text, font=font_title_lg, fill=INK)

    bbox2 = draw.textbbox((0, 0), sub_text, font=font_subhead)
    w2 = bbox2[2] - bbox2[0]
    draw.text((cx - w2 // 2, cy + 40), sub_text, font=font_subhead, fill=MADDER)

    draw.line([(cx - 70, cy + 110), (cx + 70, cy + 110)], fill=MADDER, width=3)

    bbox3 = draw.textbbox((0, 0), tag_text, font=font_body)
    w3 = bbox3[2] - bbox3[0]
    draw.text((cx - w3 // 2, cy + 140), tag_text, font=font_body, fill=INK_MUTED)

    draw_subtitles(draw, "What if Hyderabad was an open living atlas waiting to be unlocked?")
    return im

def render_shot_02(frame_idx, p):
    # spotlight-hero-card (4 - 8.5s)
    im = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(im, "RGBA")

    draw_top_pill(draw, "17.3616° N, 78.4747° E · 1591 CE")

    # Charminar Hero Card
    card_w = 920
    card_h = 1000
    card_img = fit_crop(img_charminar, card_w, card_h)
    
    # Bottom vignette on card
    card_draw = ImageDraw.Draw(card_img, "RGBA")
    card_draw.rectangle([(0, card_h - 320), (card_w, card_h)], fill=(20, 14, 10, 210))
    card_draw.text((45, card_h - 260), "ICONIC MONUMENT #01", font=font_badge, fill=GOLD_TEXT)
    card_draw.text((45, card_h - 210), "Charminar", font=font_title_md, fill=(255, 255, 255))
    card_draw.text((45, card_h - 130), "Four Grand Minarets at the Crossroad of Four Empires", font=font_caption, fill=(230, 225, 218))

    rounded = rounded_card(card_img, radius=32)
    # Paste with shadow
    x0 = (WIDTH - card_w) // 2
    y0 = 210 + int(p * 20)
    im.paste(rounded, (x0, y0), mask=rounded)

    # Bottom stat
    bbox = draw.textbbox((0, 0), "85 HISTORIC GEMS", font=font_title_md)
    w = bbox[2] - bbox[0]
    draw.text(((WIDTH - w) // 2, 1310), "85 HISTORIC GEMS", font=font_title_md, fill=MADDER)
    
    sub = "From Qutb Shahi Tombs to Restored Stepwells"
    bbox_s = draw.textbbox((0, 0), sub, font=font_body)
    ws = bbox_s[2] - bbox_s[0]
    draw.text(((WIDTH - ws) // 2, 1385), sub, font=font_body, fill=INK_MUTED)

    draw_subtitles(draw, "Beyond the IT towers and biryani lies a city of lost stepwells and whispered folklore.")
    return im

def render_shot_03(frame_idx, p):
    # deck-deal-flyin (8.5 - 13s)
    im = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(im, "RGBA")

    draw_top_pill(draw, "CURATED BY COMMUNITY")

    bbox = draw.textbbox((0, 0), "37 Lesser-Known Gems", font=font_title_md)
    w = bbox[2] - bbox[0]
    draw.text(((WIDTH - w) // 2, 180), "37 Lesser-Known Gems", font=font_title_md, fill=INK)

    sub = "Sourced from Karthik Vatsavayi's Research"
    bbox_s = draw.textbbox((0, 0), sub, font=font_body)
    ws = bbox_s[2] - bbox_s[0]
    draw.text(((WIDTH - ws) // 2, 250), sub, font=font_body, fill=MADDER)

    # 3 Fanned Heritage Cards
    cards_data = [
        (img_gachibowli, "200-YEAR STEPWELL", "Gachibowli Bowli (Lime Plaster)", 340, -4),
        (img_premamati, "QUTB SHAHI MOSQUE", "Premamati Mosque", 680, 3),
        (img_residency, "COLONIAL PALLADIAN", "British Residency (1805)", 1020, -2),
    ]

    card_w = 880
    card_h = 320

    for i, (c_img, cat, name, target_y, rot) in enumerate(cards_data):
        card_p = min(max((p - i * 0.18) * 2.5, 0.0), 1.0)
        curr_y = int(target_y + (1.0 - card_p) * 400)
        
        c_fitted = fit_crop(c_img, card_w, card_h)
        cdraw = ImageDraw.Draw(c_fitted, "RGBA")
        cdraw.rectangle([(0, card_h - 130), (card_w, card_h)], fill=(18, 12, 8, 220))
        cdraw.text((30, card_h - 110), cat, font=font_badge, fill=GOLD_TEXT)
        cdraw.text((30, card_h - 75), name, font=font_subhead, fill=(255, 255, 255))
        
        c_round = rounded_card(c_fitted, radius=24)
        c_rot = c_round.rotate(rot, resample=Image.Resampling.BICUBIC, expand=True)
        im.paste(c_rot, ((WIDTH - c_rot.size[0]) // 2, curr_y), mask=c_rot)

    draw_subtitles(draw, "Discover 37 lesser-known sanctuaries hidden in plain sight across Telangana.")
    return im

def render_shot_04(frame_idx, p):
    # paper-title-card (13 - 15s)
    im = Image.new("RGB", (WIDTH, HEIGHT), (245, 239, 227))
    draw = ImageDraw.Draw(im, "RGBA")

    # Large deckled-edge paper card in center
    cw = 920
    ch = 720
    cx = (WIDTH - cw) // 2
    cy = (HEIGHT - ch) // 2 - 40

    draw.rounded_rectangle([(cx, cy), (cx + cw, cy + ch)], radius=32, fill=CREAM, outline=BORDER_COLOR, width=4)
    draw.rounded_rectangle([(cx + 16, cy + 16), (cx + cw - 16, cy + ch - 16)], radius=24, outline=(139, 58, 26, 40), width=2)

    # Vector hourglass
    hx, hy = WIDTH // 2, cy + 110
    draw.polygon([(hx - 36, hy - 40), (hx + 36, hy - 40), (hx, hy)], fill=MADDER)
    draw.polygon([(hx - 36, hy + 40), (hx + 36, hy + 40), (hx, hy)], fill=MADDER)
    draw.line([(hx - 44, hy - 42), (hx + 44, hy - 42)], fill=MADDER, width=4)
    draw.line([(hx - 44, hy + 42), (hx + 44, hy + 42)], fill=MADDER, width=4)

    title = "TIME TRAVEL"
    bbox = draw.textbbox((0, 0), title, font=font_title_lg)
    draw.text(((WIDTH - (bbox[2] - bbox[0])) // 2, cy + 220), title, font=font_title_lg, fill=MADDER)

    era = "1562  TO  1948"
    bbox_e = draw.textbbox((0, 0), era, font=font_title_md)
    draw.text(((WIDTH - (bbox_e[2] - bbox_e[0])) // 2, cy + 330), era, font=font_title_md, fill=INK)

    desc = "Scrub 400 years of living history across four grand dynasties."
    bbox_d = draw.textbbox((0, 0), desc, font=font_body)
    draw.text(((WIDTH - (bbox_d[2] - bbox_d[0])) // 2, cy + 460), desc, font=font_body, fill=INK_MUTED)

    draw_subtitles(draw, "Scrub back four centuries of living history in real-time.")
    return im

def render_shot_05(frame_idx, p):
    # interactive-walkable-diorama (15 - 19s)
    im = Image.new("RGB", (WIDTH, HEIGHT), (20, 15, 11))
    
    # Pan across 3 districts (evening-bazaar -> bangle-lane -> hidden-courtyard)
    strip_w = WIDTH * 3
    s1 = fit_crop(img_square, WIDTH, HEIGHT)
    s2 = fit_crop(img_lane, WIDTH, HEIGHT)
    s3 = fit_crop(img_courtyard, WIDTH, HEIGHT)

    offset_x = int(p * (WIDTH * 2))
    
    strip = Image.new("RGB", (strip_w, HEIGHT))
    strip.paste(s1, (0, 0))
    strip.paste(s2, (WIDTH, 0))
    strip.paste(s3, (WIDTH * 2, 0))

    cropped = strip.crop((offset_x, 0, offset_x + WIDTH, HEIGHT))
    im.paste(cropped, (0, 0))

    draw = ImageDraw.Draw(im, "RGBA")
    # District tag
    dist_names = ["Charminar Square", "Laad Bazaar Bangle Lane", "The Hidden Courtyard"]
    curr_d = dist_names[min(int(p * 3), 2)]
    badge_txt = f"DISTRICT: {curr_d.upper()}"
    bbox_b = draw.textbbox((0, 0), badge_txt, font=font_subhead)
    bw = bbox_b[2] - bbox_b[0]
    draw.rounded_rectangle([(60, 90), (60 + bw + 40, 150)], radius=16, fill=(0, 0, 0, 190), outline=(232, 200, 139, 160), width=2)
    draw.text((80, 105), badge_txt, font=font_subhead, fill=GOLD_TEXT)

    # Bottom title overlay
    draw.rectangle([(0, HEIGHT - 420), (WIDTH, HEIGHT)], fill=(16, 12, 9, 210))
    draw.text((60, HEIGHT - 370), "3-DISTRICT LIVING DIORAMA", font=font_badge, fill=GOLD_TEXT)
    draw.text((60, HEIGHT - 325), "An Evening at Charminar", font=font_title_md, fill=(255, 255, 255))
    draw.text((60, HEIGHT - 245), "Irani chai counters · Lacquer bangles · Vintage radios", font=font_body, fill=(225, 220, 210))

    draw_subtitles(draw, "Wander through Laad Bazaar at twilight and eavesdrop on historic tea counters.")
    return im

def render_shot_06(frame_idx, p):
    # cipher-tumbler-macro (19 - 24s)
    im = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(im, "RGBA")

    draw_top_pill(draw, "IN-WORLD MYSTERY")

    title = "The Nizam's Lost Heirloom Box"
    bbox = draw.textbbox((0, 0), title, font=font_title_md)
    draw.text(((WIDTH - (bbox[2] - bbox[0])) // 2, 180), title, font=font_title_md, fill=INK)

    sub = "4 Tactile Mechanical Ciphers"
    bbox_s = draw.textbbox((0, 0), sub, font=font_body)
    draw.text(((WIDTH - (bbox_s[2] - bbox_s[0])) // 2, 250), sub, font=font_body, fill=MADDER)

    # Casket Box Container
    box_w = 920
    box_h = 880
    bx = (WIDTH - box_w) // 2
    by = 330
    draw.rounded_rectangle([(bx, by), (bx + box_w, by + box_h)], radius=32, fill=(253, 249, 240), outline=BORDER_COLOR, width=4)

    # 4 Locks Status Rows
    locks = [
        ("1. Lacquer Bangles", "GREEN - RED - GREEN [OK]", p > 0.15),
        ("2. 1889 Clockworks", "4:45 PM [SOLVED]", p > 0.35),
        ("3. Akashvani Radio", "880 kHz [TUNED]", p > 0.55),
        ("4. Crescent Seal", "FACING RIGHT [OK]", p > 0.75),
    ]

    for i, (lname, lstatus, active) in enumerate(locks):
        ry = by + 60 + i * 110
        draw.text((bx + 50, ry), lname, font=font_subhead, fill=INK)
        
        color_bg = (209, 250, 229) if active else (243, 244, 246)
        color_fg = GREEN_ACCENT if active else (156, 163, 175)
        text_st = lstatus if active else "LOCKED ..."
        
        bbox_st = draw.textbbox((0, 0), text_st, font=font_badge)
        tw = bbox_st[2] - bbox_st[0]
        rx = bx + box_w - tw - 90
        draw.rounded_rectangle([(rx, ry - 6), (rx + tw + 30, ry + 42)], radius=12, fill=color_bg)
        draw.text((rx + 15, ry + 2), text_st, font=font_badge, fill=color_fg)

    # Pearl Reward Box Pop
    if p > 0.5:
        p_pop = min((p - 0.5) * 2.5, 1.0)
        py0 = by + 530
        draw.rounded_rectangle([(bx + 40, py0), (bx + box_w - 40, py0 + 260)], radius=24, fill=(254, 243, 199), outline=(245, 158, 11), width=3)
        
        # Lustrous Pearl Vector
        px, py = WIDTH // 2, py0 + 55
        draw.ellipse([(px - 36, py - 36), (px + 36, py + 36)], fill=(255, 252, 242), outline=(245, 158, 11), width=4)
        draw.ellipse([(px - 14, py - 20), (px - 4, py - 10)], fill=(255, 255, 255))
        
        r_title = "Unlocked: Royal Basra Pearl"
        bbox_r = draw.textbbox((0, 0), r_title, font=font_subhead)
        draw.text(((WIDTH - (bbox_r[2] - bbox_r[0])) // 2, py0 + 115), r_title, font=font_subhead, fill=(146, 64, 14))

        r_sub = "+150 Passport Points · 'Master Sleuth' Badge"
        bbox_rs = draw.textbbox((0, 0), r_sub, font=font_caption)
        draw.text(((WIDTH - (bbox_rs[2] - bbox_rs[0])) // 2, py0 + 175), r_sub, font=font_caption, fill=(180, 83, 9))

    draw_subtitles(draw, "And crack the four secret ciphers of the Nizam’s lost heirloom box.")
    return im

def render_shot_07(frame_idx, p):
    # outro-group-photo-launch (24 - 30s)
    im = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(im, "RGBA")

    cx, cy = WIDTH // 2, 540

    # Big Gold Badge
    draw.ellipse([(cx - 100, cy - 100), (cx + 100, cy + 100)], fill=MADDER, outline=(168, 68, 31), width=6)
    
    # 8-pointed gold star
    for ang in [0, 45, 90, 135]:
        rad_ang = math.radians(ang)
        dx = math.cos(rad_ang) * 55
        dy = math.sin(rad_ang) * 55
        draw.line([(cx - dx, cy - dy), (cx + dx, cy + dy)], fill=(255, 255, 255), width=6)
    draw.ellipse([(cx - 16, cy - 16), (cx + 16, cy + 16)], fill=(255, 255, 255))

    title = "DECCAN HERITAGE MAP"
    bbox = draw.textbbox((0, 0), title, font=font_title_lg)
    draw.text(((WIDTH - (bbox[2] - bbox[0])) // 2, cy + 150), title, font=font_title_lg, fill=INK)

    sub = "REDISCOVER HYDERABAD'S SOUL"
    bbox_s = draw.textbbox((0, 0), sub, font=font_subhead)
    draw.text(((WIDTH - (bbox_s[2] - bbox_s[0])) // 2, cy + 250), sub, font=font_subhead, fill=MADDER)

    # 3 Pills
    pills = ["85 Sites", "400 Years", "Old City Lore"]
    start_x = 120
    for i, pill in enumerate(pills):
        px = start_x + i * 290
        draw.rounded_rectangle([(px, cy + 340), (px + 260, cy + 410)], radius=16, fill=(255, 255, 255), outline=BORDER_COLOR, width=2)
        bbox_p = draw.textbbox((0, 0), pill, font=font_caption)
        pw = bbox_p[2] - bbox_p[0]
        draw.text((px + (260 - pw) // 2, cy + 360), pill, font=font_caption, fill=INK)

    # Huge CTA Button
    btn_w = 680
    btn_h = 130
    bx = (WIDTH - btn_w) // 2
    by = cy + 480
    draw.rounded_rectangle([(bx, by), (bx + btn_w, by + btn_h)], radius=65, fill=MADDER, outline=(168, 68, 31), width=4)
    
    btn_text = "EXPLORE THE ATLAS FREE ->"
    bbox_b = draw.textbbox((0, 0), btn_text, font=font_subhead)
    draw.text(((WIDTH - (bbox_b[2] - bbox_b[0])) // 2, by + (btn_h - (bbox_b[3] - bbox_b[1])) // 2 - 4), btn_text, font=font_subhead, fill=(255, 255, 255))

    note = "Open on Mobile & Desktop · No App Download Needed"
    bbox_n = draw.textbbox((0, 0), note, font=font_caption)
    draw.text(((WIDTH - (bbox_n[2] - bbox_n[0])) // 2, by + 180), note, font=font_caption, fill=INK_MUTED)

    draw_subtitles(draw, "Deccan Heritage Map. Rediscover the city you thought you knew.")
    return im

# ---------------------------------------------------------------------------
# Main Video Generation Pipeline
# ---------------------------------------------------------------------------
def main():
    generate_audio()

    print(f"Launching FFmpeg video pipe: 1080x1920 @ {FPS}fps, total {TOTAL_FRAMES} frames...")
    
    cmd = [
        "ffmpeg",
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_WAV,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        OUTPUT_MP4
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    try:
        for f in range(TOTAL_FRAMES):
            t = f / FPS
            
            # Determine shot
            if t < 4.0:
                p = t / 4.0
                frame = render_shot_01(f, p)
            elif t < 8.5:
                p = (t - 4.0) / 4.5
                frame = render_shot_02(f, p)
            elif t < 13.0:
                p = (t - 8.5) / 4.5
                frame = render_shot_03(f, p)
            elif t < 15.0:
                p = (t - 13.0) / 2.0
                frame = render_shot_04(f, p)
            elif t < 19.0:
                p = (t - 15.0) / 4.0
                frame = render_shot_05(f, p)
            elif t < 24.0:
                p = (t - 19.0) / 5.0
                frame = render_shot_06(f, p)
            else:
                p = (t - 24.0) / 6.0
                frame = render_shot_07(f, p)

            proc.stdin.write(frame.tobytes())

            if f % 90 == 0:
                print(f"Rendered frame {f}/{TOTAL_FRAMES} ({t:.1f}s / {TOTAL_SEC:.0f}s)...")

        proc.stdin.close()
        proc.wait()
    except Exception as e:
        proc.kill()
        raise e

    if os.path.exists(OUTPUT_MP4):
        size_mb = os.path.getsize(OUTPUT_MP4) / (1024 * 1024)
        print(f"SUCCESS: Generated {OUTPUT_MP4} ({size_mb:.2f} MB)")
    else:
        print("ERROR: Output file not found.")

if __name__ == "__main__":
    main()
