from cms.models.pluginmodel import CMSPlugin
from django.conf import settings
import os
import random

def create_picture_plugin(filename, file, parent_plugin, **kwargs):
    from cms.plugins.picture.models import Picture
    pic = Picture()
    pic.placeholder = parent_plugin.placeholder
    pic.parent = parent_plugin
    pic.position = CMSPlugin.objects.filter(parent=parent_plugin).count()
    pic.language = parent_plugin.language
    pic.plugin_type = 'PicturePlugin'
    path = pic.get_media_path(filename)
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.exists(os.path.dirname(full_path)):
        os.makedirs(os.path.dirname(full_path))
    pic.image = path
    f = open(full_path, "wb")
    f.write(file)
    f.close()
    pic.save()
    return pic
