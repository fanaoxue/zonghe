#coding:utf-8
import sys
import os
import time
import shutil
import zipfile

"""
使用方法：
python new_dist.py project1
注意：需要提前把main函数中source和dest变量变成文档的绝对路径
"""

def main(source,dest,project):
	print ("mission start...")
	now_time = time.strftime('%Y-%m-%d-%H-%M-%S') #获取当前时间

	for file in os.listdir(source): #每个project文件夹备份
		if file != project: #挑选目标project
			continue
		file_path = os.path.join(source, file)
		# print file_path
		back_path = os.path.join(source, "backup/"+file)  #备份目录
		# print back_path
		if not os.path.exists(back_path): #创建备份目录
			os.makedirs(back_path)
		dist_s = os.path.join(file_path,"dist")
		backup_dir = os.path.join(back_path,now_time)

		if not os.path.exists(backup_dir): #创建备份dist
			os.makedirs(backup_dir)

		"""复制dist文件夹"""
		dist_d = os.path.join(backup_dir,"dist")
		if not os.path.exists(dist_d):
			# os.makedirs(dist)
			shutil.copytree(dist_s,dist_d)

		"""压缩dist文件夹"""
		zipname = os.path.join(backup_dir,file + ".zip")
		if not os.path.exists(zipname):
			zipDir(dist_s,zipname)

		"""构造project_nginx文件夹"""
		project_nginx = os.path.join(backup_dir,file + "_nginx")
		if not os.path.exists(project_nginx):
			os.makedirs(project_nginx)
			os.makedirs(project_nginx + "/dist")
			for f in os.listdir(dist_s): #复制所有文件到project_nginx文件夹
				p = os.path.join(dist_s,f)
				if os.path.isfile(p) and f[0] != '.': #mac隐藏文件以.开头，这里屏蔽
					shutil.copy(p,project_nginx+"/dist/"+f)

		"""构造project_CDN文件夹"""
		project_CDN = os.path.join(backup_dir,file + "_CDN")
		if not os.path.exists(project_CDN):
			os.makedirs(project_CDN)
			dist_d = project_CDN + "/dist"
			shutil.copytree(dist_s,dist_d)
			for f in os.listdir(dist_d): #删除所有复制的文件
				p = os.path.join(dist_d,f)
				if os.path.isfile(p) and f[0] != '.':
					os.remove(p)
			zipname = os.path.join(project_CDN,file+".zip")
			zipDir(dist_d,zipname)

	print ("mission complete!")

def zipDir(dirpath,outFullName):
    """
    压缩指定文件夹
    :param dirpath: 目标文件夹路径
    :param outFullName: 压缩文件保存路径+xxxx.zip
    :return: 无
    """
    zip = zipfile.ZipFile(outFullName,"w",zipfile.ZIP_DEFLATED)
    for path,dirnames,filenames in os.walk(dirpath):
        # 去掉目标跟路径，只对目标文件夹下边的文件及文件夹进行压缩
        fpath = path.replace(dirpath,'')
        fpath = fpath and fpath + os.sep or ''
        fpath = path.replace(dirpath,'dist')

        for filename in filenames:
            zip.write(os.path.join(path,filename),os.path.join(fpath,filename))
    zip.close()

if __name__ == "__main__":
	# project = sys.argv[1]
	# print ("backup project: ",project)
	# source = "/Users/zhangfei/Downloads/work"
	# dest = "/Users/zhangfei/Downloads/work"
	source = os.path.abspath('..')
	dest = os.path.abspath('..')
	# project = os.path.basename(os.path.abspath('.')).replace('-','_')
	project = os.path.basename(os.path.abspath('.'))
	print ("source folder: " + source)
	print ("dest folder: " + dest)
	print ("project folder: " + project)
	main(source,dest,project)
