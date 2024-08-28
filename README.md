方案说明

提取视频首关键帧，保存成图片。
利用AWS S3 + Lambda处理方式。上传视频到S3指定的存储桶时，将触发S3事件，触发事件将传递事件给Lambda，由Lambda完成视频处理。
视频处理可以利用ffmpeg开源软件，ffmpeg目前在AWS SAM上已经提供对应的Lambda layer（类似依赖包）。使用时只要把对应的layer引入到Lambda函数中。

前提条件

提供两个同区域的存储桶，分别是目标和来源。
来源桶要求：vod-source-ap-southeast-1-xxx。来源桶下建议创建子目录，用于上传来源视频文件：
目标桶要求：vod-destination-ap-southeast-1-xxx。目标桶创建子目录，用于保存图片。
