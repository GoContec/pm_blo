# -*- encoding: utf-8 -*-
"""
Cop
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()yright (c) 2019 - present AppSeed.us
"""

from apps import db, login_manager
import requests

from apps.authentication.util import hash_pass


class motions(db.Model):

    __tablename__ = 'motions'

    id = db.Column(db.Integer, primary_key=True)
    area = db.Column(db.String)
    timeadded = db.Column(db.Integer)
    warehouse = db.Column(db.Integer)
    station_type = db.Column(db.Integer)

    def __init__(self, **kwargs):
        for property, value in kwargs.items():
            # depending on whether value is an iterable or not, we must
            # unpack it's value (when **kwargs is request.form, some values
            # will be a 1-element list)

            if hasattr(value, '__iter__') and not isinstance(value, str):
                # the ,= unpack of a singleton fails PEP8 (travis flake8 test)
                value = value[0]


            setattr(self, property, value)

    def __repr__(self):
        return str(self.id)


    def motion_loader(id):
        motion = motions.query.filter_by(id=id).first()
        db.session.remove()
        db.session.close()
        db.session.commit()
        return motion


    def motion_loader(request):
        station = request.form.get('station')
        stations = motions.query.filter_by(station=station).first()
        db.session.remove()
        db.session.close()
        db.session.commit()
        return stations if stations else None

    def motion_loader_byarea(area, warehous='2', station_typ='1', fromtime=14400, totime=119):
        qrl = str(" ( Select pre_timestamp, pre_id, cid, area, timeadded, time_difference,    warehouse, "
                  "station_type from motionsgroup Where (to_timestamp(timeadded) AT TIME ZONE 'PST') >= current_date - 7"
                  " and time_difference < "+str(fromtime)+" and time_difference > "+str(totime)+" and area =  '"+area+"' and "
                  " warehouse= "+warehous+" and station_type= "+station_typ+" order by time_difference desc ) "
                  " UNION ALL (select (select timeadded as  pretimestamp from motions where id < cid   and "
                  " area =  '"+area+"' and warehouse= "+warehous+" and station_type= "+station_typ+" "
                   " order by id desc limit 1),(select id as pre_id from "
                   "motions where id < cid  and area = '"+area+"' and warehouse= "+warehous+" and station_type= "+station_typ+" "
                   " order by id desc limit 1), "
                    "cid, area,timeadded, timestamp_diff,warehouse,station_type from (select id as cid, area, "
                   "timeadded, timeadded - lag(timeadded) "
                   "over (order by timeadded) as timestamp_diff, "
                   "(to_timestamp(timeadded - lag(timeadded) "
                   "over (order by timeadded)/1000) AT TIME ZONE 'PST') "
                   "as dd, (to_timestamp(timeadded - lag(timeadded) "
                   "over (order by timeadded)/1000) AT TIME ZONE 'PST')::timestamp::date as "
                   "ddate,warehouse,station_type from motions where area = '"+area+"' and warehouse= "+warehous+""
                  " and station_type= "+station_typ+" AND  (to_timestamp(timeadded) AT TIME ZONE 'PST') "
                    ">= current_date - 7  order by timeadded ) t where (timestamp_diff < 14400 "
                    "and timestamp_diff > 119) order by timestamp_diff desc)")
        
        stations = db.session.execute(qrl)
        db.session.remove()
        db.session.close()
        db.session.commit()
        return stations if stations else None
    
    def motion_loader_byarea_date(area, startdate,enddate ,day, warehous='2', station_typ='1', fromtime=14400, totime=119):
        startdate = str(startdate)[:10]
        enddate = str(enddate)[:10]

        if int(day) == 1:
            qrl = str("(select (select timeadded as  pretimestamp from motions where id < cid   and "
                    " area =  '"+area+"' and warehouse= "+warehous+" and station_type= "+station_typ+" "
                    " order by id desc limit 1),(select id as pre_id from "
                    "motions where id < cid  and area = '"+area+"' and warehouse= "+warehous+" and station_type= "+station_typ+" "
                    " order by id desc limit 1), "
                        "cid, area,timeadded, timestamp_diff,warehouse,station_type, (Select tagname from episodetags  left join tags ON tags.id=episodetags.tag Where starttime=(select timeadded as  pretimestamp from motions where id < cid   and "
                    " area =  '"+area+"' and warehouse= "+warehous+" and station_type= "+station_typ+" "
                    " order by id desc limit 1) and endtime=timeadded and station = '"+area+"' limit 1) from (select id as cid, area, "
                    "timeadded, timeadded - lag(timeadded) "
                    "over (order by timeadded) as timestamp_diff, "
                    "(to_timestamp(timeadded - lag(timeadded) "
                    "over (order by timeadded)/1000) AT TIME ZONE 'PST') "
                    "as dd, (to_timestamp(timeadded - lag(timeadded) "
                    "over (order by timeadded)/1000) AT TIME ZONE 'PST')::timestamp::date as "
                    "ddate,warehouse,station_type  "
                    " from motions where area = '"+area+"' and warehouse= "+warehous+""
                    " and station_type= "+station_typ+" AND   timeadded > "+str(startdate)+" and timeadded < "+str(enddate)+""
                        "   order by timeadded ) t where (timestamp_diff < 14400 "
                        "and timestamp_diff > 119) order by timestamp_diff desc)")
        else:
            qrl = str(" ( Select pre_timestamp, pre_id, cid, area, timeadded, time_difference,    warehouse, "
                  "station_type, (Select tagname from episodetags  left join tags ON tags.id=episodetags.tag Where starttime=pre_timestamp and endtime=timeadded and station = '"+area+"' limit 1) from motionsgroup Where  "
                  "   timeadded > "+str(startdate)+" and timeadded  < "+str(enddate)+" and area =  '"+area+"' and "
                  " warehouse= "+warehous+" and station_type= "+station_typ+" order by time_difference desc ) ")
        
        stations = db.session.execute(qrl)
        db.session.remove()
        db.session.close()
        db.session.commit()
        return stations if stations else None

    def actionin_box_area(area):
        qry = str("select (select timeadded as  pretimestamp from motions where id < cid   "
                "and area =  '"+area+"' order by id desc limit 1), "
                "(select id as pre_id from motions where id < cid  and area = '"+area+"' "
                "order by id desc limit 1), cid, area,timeadded, timestamp_diff,dd from "
                "(select id as cid, area, timeadded, timeadded - lag(timeadded) over "
                "(order by timeadded) as timestamp_diff, (to_timestamp(timeadded - lag(timeadded) "
                "over (order by timeadded)/1000) AT TIME ZONE 'UTC') as dd, "
                "(to_timestamp(timeadded - lag(timeadded) over (order by timeadded)/1000) "
                "AT TIME ZONE 'UTC')::timestamp::date as ddate from motions where area = '"+area+"' "
                "AND  (to_timestamp(timeadded) AT TIME ZONE 'PST') >= current_date - 7 order by timeadded ) "
                "t where  (timestamp_diff > 0 and timestamp_diff < 30) order by cid  desc; ")
        box_cnt = db.session.execute(qry)
        db.session.remove()
        db.session.close()
        db.session.commit()
        return box_cnt if box_cnt else None

    def add_data(values):
        qry = ("INSERT INTO  directshipping (scantime,station,operator,product,eventtype,"
               "shipid,errorcode,errormessage,siteid) VALUES ('"+values['scantime']+"','"+values['station']+"',"
                "'"+values['operator']+"','"+values['product']+"','"+values['eventtype']+"','"+values['shipid']+"'"
                ",'"+values['errorcode']+"','"+values['errormessage']+"','"+str(values['siteid'])+"') ")

        db.session.execute(qry)
        db.session.commit()
        db.session.remove()
        db.session.close()
        return qry
    
    def add_episode_tag(tag, station, starttime, endtime):
        qry = ("INSERT INTO  episodetags (starttime, endtime, station, tag) VALUES ('"+starttime+"','"+endtime+"',"
                "'"+station+"','"+tag+"') ")

        db.session.execute(qry)
        db.session.commit()
        db.session.remove()
        db.session.close()
        return qry

    def get_cnt_lastweek(area):
        qry = str("SELECT DISTINCT(count(shipid)) as cnt FROM public.directshipping "
                  "Where station='"+area+"' AND (to_timestamp(EXTRACT (epoch  FROM  "
                  "to_timestamp(scantime, 'YYYY-MM-DD hh24:mi:ss')::timestamp)) AT TIME ZONE 'PST') < current_date - 7 "
                  "AND (to_timestamp(EXTRACT (epoch  FROM  to_timestamp(scantime, 'YYYY-MM-DD hh24:mi:ss')::timestamp)) "
                  "AT TIME ZONE 'PST') >= current_date - 14 ")
        box_cnt = db.session.execute(qry)
        db.session.remove()
        db.session.close()
        db.session.commit()
        return box_cnt if box_cnt else None

    def actionin_shipping_data(area):
        qry = str("select cid, station ,timestamp_diff,scantimee,EXTRACT (hour  FROM to_timestamp(scantime, "
                  "'YYYY-MM-DD hh24:mi:ss')::timestamp),to_timestamp(scantimee)::date as dateadded, product ,siteid   from (select DISTINCT shipid, id as cid, station,scantime, EXTRACT "
                  "(epoch  FROM  to_timestamp(scantime, 'YYYY-MM-DD hh24:mi:ss')::timestamp  AT TIME ZONE 'PST') as scantimee, "
                  "EXTRACT (epoch  FROM  to_timestamp(scantime, 'YYYY-MM-DD hh24:mi:ss')::timestamp  AT TIME ZONE 'PST') - "
                  "lag(EXTRACT (epoch FROM  to_timestamp(scantime, 'YYYY-MM-DD hh24:mi:ss')::timestamp  AT TIME ZONE 'PST')) "
                  "over (order by EXTRACT (epoch  FROM  to_timestamp(scantime, 'YYYY-MM-DD hh24:mi:ss')::timestamp  AT TIME ZONE 'PST')) "
                  "as timestamp_diff, product,siteid from directshipping where station='"+area+"' AND  "
                  "(to_timestamp(EXTRACT (epoch  FROM  to_timestamp(scantime, 'YYYY-MM-DD hh24:mi:ss')::timestamp)) "
                  "AT TIME ZONE 'PST') >= current_date - 7 order by id desc ) t  "
                  "where  (timestamp_diff > 0 ) order by scantimee  desc")

        box_cnt = db.session.execute(qry)
        db.session.remove()
        db.session.close()
        db.session.commit()
        return box_cnt if box_cnt else None
    

    def actionin_shipping_data_tag(area):
        qry = str("Select id,tagname from tags")

        box_cnt = db.session.execute(qry)
        db.session.remove()
        db.session.close()
        db.session.commit()
        return box_cnt if box_cnt else None

    def actionin_tag_data(area):
        qry = str("Select starttime,endtime,station,tag,tagname from episodetags left join tags ON tags.id=episodetags.tag "
        " Where   (to_timestamp(starttime) AT TIME ZONE 'PST') >= current_date - 7 AND station='"+area+"'")
        
        box_cnt = db.session.execute(qry)
        db.session.remove()
        db.session.close()
        db.session.commit()
        return box_cnt if box_cnt else None

