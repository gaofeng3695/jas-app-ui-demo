init_sql = ["create table if not exists DaqProject (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,name text,userId text,lastUpdateTime text,code text)",//项目表
            "create table if not exists DaqTenders (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,name text,projectOid text,userId text)",//标段表
            "create table if not exists DaqPipeline (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,name text,tendersOid text,userId text)",//管线表
            "create table if not exists DaqPipeSegmentOrCross (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,name text,pipelineOid text,userId text)",//线路段和穿跨越列表
            "create table if not exists DaqSupervisionUnit (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,name text,tendersOid text,userId text)",//监理单位
            //"create table if not exists DaqMedianStake (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,stakeCode text,pipeSegmentOrCrossOid text,userId text)",//中线桩列表
            "create table if not exists DaqMaterialPipe (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,pipeCode text,userId text,backIsUse integer,frontIsUse integer,isColdBend integer,lastUpdateTime text,projectOid text)",//钢管表
            "create table if not exists DaqClodBendingPipe (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,clodBendingPipeCode text,userId text,tendersOid text,pipeSegmentOrCrossOid text,backIsUse integer,frontIsUse integer,approveStatus integer,projectOid text,isMeasure integer)",//冷弯管表
            "create table if not exists DaqMaterialHotBends (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,hotBendsCode text,userId text,backIsUse integer,frontIsUse integer,projectOid text,isMeasure integer)",//热煨弯管表
            "create table if not exists DaqMaterialTee (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,teeCode text,userId text,isUse integer,projectOid text)",//三通表
            "create table if not exists DaqMaterialJnsulatedJoint (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,manufacturerCode text,userId text,isUse integer,projectOid text)",//绝缘接头
            "create table if not exists DaqMaterialReducer (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,reducerCode text,userId text,isUse integer,projectOid text)",//大小头
            "create table if not exists DaqMaterialClosure (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,closureCode text,userId text,isUse integer,projectOid text)",//封堵物
            "create table if not exists DaqMaterialValve (id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,valveName text,userId text,isUse integer,projectOid text)",//阀门
            "create table if not exists DaqWorkUnit(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,workUnitName text,projectOid text,workUnitType text,userId text,lastUpdateTime text)",//施工机组表
            "create table if not exists DaqWeldProduceSpecification(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,weldProduceCode text,projectOid text,userId text)",//焊接工艺表
            "create table if not exists DaqWorkPersonnel(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,personnelName text,workUnitOid text,personnelType text,userId text)",//机组人员表
            "create table if not exists DaqSysDomain(id INTEGER PRIMARY KEY AUTOINCREMENT,codeId text,codeName text,domainName text,lastUpdateTime text)",//离线域值表
            "create view if not exists vDaqMaterial as select oid,pipeCode as code from DaqMaterialPipe union all select oid,clodBendingPipeCode as code from DaqClodBendingPipe union all select oid,hotBendsCode as code from DaqMaterialHotBends union all select oid,teeCode as code from DaqMaterialTee union all select oid,manufacturerCode as code from DaqMaterialJnsulatedJoint union all select oid,reducerCode as code from DaqMaterialReducer union all select oid,closureCode as code from DaqMaterialClosure",//线路物质视图
            "create table if not exists IpConfig (id INTEGER PRIMARY KEY AUTOINCREMENT,protocol text,ip text,port text)",//ip设置表
            "create table if not exists login_info(id INTEGER PRIMARY KEY AUTOINCREMENT,registNum text,pwd text,lastLoginDate text)",//用户登录信息表
            "create table if not exists userAndProjectRelation(id INTEGER PRIMARY KEY AUTOINCREMENT,projectOid text,projectName text,userId text,userName text)",//用户与默认企业关系表
            "create table if not exists priUser(id INTEGER PRIMARY KEY AUTOINCREMENT,userId text,userName text,loginName text,pwd text,unitId text,unitName text,lastUpdateTime text)",//施工单位用户离线数据信息表
            "create table if not exists DaqCheckCoatingPipe(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,pipeOid text unique,projectOid text,tendersOid text,postData text,state int,userId text)",//防腐管检查
            "create table if not exists DaqCheckHotBends(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,hotBendOid text unique,projectOid text,tendersOid text,postData text,state int,userId text)",//热煨弯管检查
            "create table if not exists DaqCheckPipeColdBending(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,pipeColdBendingOid text unique,projectOid text,tendersOid text,postData text,state int,userId text)",//冷弯管检查
            
            "create table if not exists DaqWeldCodeRegular(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text, projectOid text, weldCodeRegular text, userId text, lastUpdateTime text)",//焊口规则表
            "create table if not exists DaqWeldAnticorrosionCheck(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,weldOid text unique,projectOid text,tendersOid text,pipelineOid text,pipeSegmentOrCrossOid text,postData text,state int,userId text)",//防腐补口
            "create table if not exists DaqSysAttachment(id INTEGER PRIMARY KEY AUTOINCREMENT,oid text,fileName text, businessId text,src text,state int)",//附件表
            "create table IF NOT EXISTS DaqUserFaceInfo (id INTEGER PRIMARY KEY AUTOINCREMENT, login_name text, base64_image text)" //人脸识别信息表
];
