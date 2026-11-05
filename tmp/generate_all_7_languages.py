import json
import re
import sys

# Load test datasets
with open("/tmp/all_ui_strings.json", "r", encoding="utf-8") as f:
    all_strings = json.load(f)
with open("/tmp/all_ui_words.json", "r", encoding="utf-8") as f:
    all_words = json.load(f)

# Load existing Kannada phrases and words
sys.path.append("/tmp")
from create_all_translations import kn_phrases
with open("/tmp/kn_all_968_words.json", "r", encoding="utf-8") as f:
    kn_words = json.load(f)

# Add remaining specific entries to Kannada
kn_phrases["Selected"] = "ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ"
kn_phrases["Select Language"] = "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
kn_phrases["Select Language (8)"] = "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (8)"
kn_phrases["Languages"] = "ಭಾಷೆಗಳು"
kn_phrases["Farmer Demo"] = "ರೈತ ಡೆಮೊ"
kn_phrases["Buyer Demo"] = "ಖರೀದಿದಾರ ಡೆಮೊ"
kn_phrases["Admin Demo"] = "ಅಡ್ಮಿನ್ ಡೆಮೊ"
kn_phrases["Farmer Portal"] = "ರೈತ ಪೋರ್ಟಲ್"
kn_phrases["Wholesale Buyer Portal"] = "ಸಗಟು ಖರೀದಿದಾರರ ಪೋರ್ಟಲ್"
kn_phrases["Administrator Command"] = "ಆಡಳಿತಾಧಿಕಾರಿ ಕಮಾಂಡ್"
kn_phrases["1-Click Fast Demo Login"] = "1-ಕ್ಲಿಕ್ ತ್ವರಿತ ಡೆಮೊ ಲಾಗಿನ್"
kn_phrases["Instant Access"] = "ತ್ವರಿತ ಪ್ರವೇಶ"
kn_phrases["Back to Home"] = "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ"
kn_phrases["Sign In"] = "ಸೈನ್ ಇನ್"
kn_phrases["Role-Based Authentication"] = "ಪಾತ್ರ-ಆಧಾರಿತ ದೃಢೀಕರಣ"
kn_phrases["Create Verified Account"] = "ದೃಢೀಕೃತ ಖಾತೆ ರಚಿಸಿ"
kn_phrases["Welcome Back to AgriTech"] = "ಅಗ್ರಿಟೆಕ್‌ಗೆ ಮತ್ತೆ ಸುಸ್ವಾಗತ"
kn_phrases["Join the Future of Smart Agriculture"] = "ಸ್ಮಾರ್ಟ್ ಕೃಷಿಯ ಭವಿಷ್ಯವನ್ನು ಸೇರಿ"
kn_phrases["Step 1: Choose Your Portal Role"] = "ಹಂತ 1: ನಿಮ್ಮ ಪೋರ್ಟಲ್ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ"
kn_phrases["Sign In to Existing Account"] = "ಈಗಿರುವ ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ"
kn_phrases["Register / Create Free Account"] = "ನೋಂದಾಯಿಸಿ / ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ"
kn_phrases["Remember me on this device"] = "ಈ ಸಾಧನದಲ್ಲಿ ನನ್ನನ್ನು ನೆನಪಿನಲ್ಲಿಡಿ"
kn_phrases["Accept Terms & Escrow Agreement"] = "ನಿಯಮಗಳು ಮತ್ತು ಎಸ್ಕ್ರೋ ಒಪ್ಪಂದವನ್ನು ಸ್ವೀಕರಿಸಿ"
kn_phrases["Processing Authorization..."] = "ದೃಢೀಕರಣ ಪ್ರಕ್ರಿಯೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ..."
kn_phrases["Full Name *"] = "ಪೂರ್ಣ ಹೆಸರು *"
kn_phrases["Mobile Number (OTP Verified) *"] = "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಒಟಿಪಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ) *"
kn_phrases["Email Address *"] = "ಇಮೇಲ್ ವಿಳಾಸ *"
kn_phrases["Password *"] = "ಪಾಸ್‌ವರ್ಡ್ *"
kn_phrases["Confirm Password *"] = "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ *"
kn_phrases["Forgot Password?"] = "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?"
kn_phrases["Strength:"] = "ಸಾಮರ್ಥ್ಯ:"
kn_phrases["Farm Details & Land Specs"] = "ಕೃಷಿ ವಿವರಗಳು ಮತ್ತು ಭೂಮಿ ವಿವರ"
kn_phrases["Procurement & Business Profile"] = "ಖರೀದಿ ಮತ್ತು ವ್ಯಾಪಾರ ಪ್ರೊಫೈಲ್"
kn_phrases["Farm / Estate Name"] = "ತೋಟ / ಎಸ್ಟೇಟ್ ಹೆಸರು"
kn_phrases["State & District"] = "ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ"
kn_phrases["Village / Taluk"] = "ಗ್ರಾಮ / ತಾಲೂಕು"
kn_phrases["Main Crops Cultivated"] = "ಮುಖ್ಯ ಬೆಳೆಗಳು"
kn_phrases["Buyer Type"] = "ಖರೀದಿದಾರರ ವಿಧ"
kn_phrases["Business Name / Firm"] = "ವ್ಯಾಪಾರದ ಹೆಸರು / ಸಂಸ್ಥೆ"
kn_phrases["Products Needed"] = "ಅಗತ್ಯವಿರುವ ಉತ್ಪನ್ನಗಳು"
kn_phrases["Monthly Procurement Volume"] = "ಮಾಸಿಕ ಖರೀದಿ ಪ್ರಮಾಣ"
kn_phrases["Authorized Admin Key *"] = "ಅಧಿಕೃತ ಅಡ್ಮಿನ್ ಕೀ *"
kn_phrases["Wholesale / Supermarket Chain"] = "ಸಗಟು / ಸೂಪರ್‌ಮಾರ್ಕೆಟ್ ಸರಣಿ"
kn_phrases["Aggregator / Processing Unit"] = "ಸಂಗ್ರಾಹಕ / ಸಂಸ್ಕರಣಾ ಘಟಕ"
kn_phrases["Acres"] = "ಎಕರೆಗಳು"
kn_phrases["Hectares"] = "ಹೆಕ್ಟೇರ್‌ಗಳು"

print(f"Kannada phrases updated: {len(kn_phrases)}, words: {len(kn_words)}")
