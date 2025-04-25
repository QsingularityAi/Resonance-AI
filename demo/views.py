from django.shortcuts import render

def index(request, id):
    return render(request, 'index.html', {'id': id})

def indexFullscreen(request, id):
    return render(request, 'index-fullscreen.html', {'id': id})

def indexInline(request, id):
    return render(request, 'index-inline.html', {'id': id})