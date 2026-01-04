import json

# HSK 1 data (150 words)
hsk1_data = """爱,ài,to love
八,bā,eight
爸爸,bà ba,father
杯子,bēi zi,cup
北京,Běi jīng,Beijing
本,běn,measure word for books
不客气,bù kè qi,you're welcome
不,bù,no
菜,cài,dish
茶,chá,tea
吃,chī,to eat
出租车,chū zū chē,taxi
打电话,dǎ diàn huà,to make a call
大,dà,big
的,de,possessive particle
点,diǎn,o'clock
电脑,diàn nǎo,computer
电视,diàn shì,television
电影,diàn yǐng,movie
东西,dōng xi,thing
都,dōu,all
读,dú,to read
对不起,duì bu qǐ,sorry
多,duō,many
多少,duō shao,how many
儿子,ér zi,son
二,èr,two
饭馆,fàn guǎn,restaurant
飞机,fēi jī,airplane
分钟,fēn zhōng,minute
高兴,gāo xìng,happy
个,gè,measure word
工作,gōng zuò,to work
狗,gǒu,dog
汉语,Hàn yǔ,Chinese language
好,hǎo,good
喝,hē,to drink
和,hé,and
很,hěn,very
后面,hòu mian,behind
回,huí,to return
会,huì,can
火车站,huǒ chē zhàn,train station
几,jǐ,how many
家,jiā,home
叫,jiào,to call
今天,jīn tiān,today
九,jiǔ,nine
开,kāi,to open
看,kàn,to see
看见,kàn jiàn,to see
块,kuài,measure word for money
来,lái,to come
老师,lǎo shī,teacher
了,le,particle
冷,lěng,cold
里,lǐ,inside
零,líng,zero
六,liù,six
妈妈,mā ma,mother
吗,ma,question particle
买,mǎi,to buy
猫,māo,cat
没,méi,not have
没关系,méi guān xi,it doesn't matter
米饭,mǐ fàn,rice
明天,míng tiān,tomorrow
名字,míng zi,name
哪,nǎ,which
那,nà,that
呢,ne,question particle
能,néng,can
你,nǐ,you
年,nián,year
女儿,nǚ ér,daughter
朋友,péng you,friend
漂亮,piào liang,beautiful
苹果,píng guǒ,apple
七,qī,seven
钱,qián,money
前面,qián miàn,in front
请,qǐng,please
去,qù,to go
热,rè,hot
人,rén,person
认识,rèn shi,to know
日,rì,day
三,sān,three
商店,shāng diàn,store
上,shàng,up
上午,shàng wǔ,morning
少,shǎo,few
谁,shéi,who
什么,shén me,what
十,shí,ten
时候,shí hou,time
是,shì,to be
书,shū,book
水,shuǐ,water
水果,shuǐ guǒ,fruit
睡觉,shuì jiào,to sleep
说话,shuō huà,to speak
四,sì,four
岁,suì,years old
他,tā,he
她,tā,she
太,tài,too
天气,tiān qì,weather
听,tīng,to listen
同学,tóng xué,classmate
喂,wèi,hello
我,wǒ,I
我们,wǒ men,we
五,wǔ,five
喜欢,xǐ huan,to like
下,xià,down
下午,xià wǔ,afternoon
下雨,xià yǔ,to rain
先生,xiān sheng,Mr.
现在,xiàn zài,now
想,xiǎng,to think
小,xiǎo,small
小姐,xiǎo jie,Miss
些,xiē,some
写,xiě,to write
谢谢,xiè xie,thank you
星期,xīng qī,week
学生,xué sheng,student
学习,xué xí,to study
学校,xué xiào,school
一,yī,one
衣服,yī fu,clothes
医生,yī shēng,doctor
医院,yī yuàn,hospital
椅子,yǐ zi,chair
有,yǒu,to have
月,yuè,month
在,zài,at
再见,zài jiàn,goodbye
怎么,zěn me,how
怎么样,zěn me yàng,how about
这,zhè,this
中国,Zhōng guó,China
中午,zhōng wǔ,noon
住,zhù,to live
桌子,zhuō zi,table
字,zì,character
昨天,zuó tiān,yesterday
坐,zuò,to sit
做,zuò,to do"""

# Process and create JSON
characters = []
char_id = 1

for level, data in [(1, hsk1_data)]:
    for line in data.strip().split('\n'):
        parts = line.split(',')
        if len(parts) >= 3:
            hanzi, pinyin, english = parts[0], parts[1], ','.join(parts[2:])
            characters.append({
                "id": f"hsk{level}-{char_id:03d}",
                "hanzi": hanzi,
                "pinyin": pinyin,
                "english": english,
                "hskLevel": level
            })
            char_id += 1

output = {
    "metadata": {
        "version": "1.0",
        "totalCharacters": len(characters),
        "levels": {
            "hsk1": len([c for c in characters if c["hskLevel"] == 1])
        }
    },
    "characters": characters
}

print(json.dumps(output, ensure_ascii=False, indent=2))
