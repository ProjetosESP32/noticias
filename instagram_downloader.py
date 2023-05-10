from instaloader import Instaloader, Profile
from datetime import datetime, timedelta

data_inicio = datetime.today() - timedelta(days=5)
loader = Instaloader()
profile = Profile.from_username(loader.context, 'ifmtcuiabaoficial')
posts = profile.get_posts()

for post in posts:
  if post.date >= data_inicio or post.is_pinned:
    loader.download_post(post, 'instagram')
