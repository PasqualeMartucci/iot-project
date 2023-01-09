### author: SALVATORE IANDOLO / PASQUALE MARTUCCI

import serial
import numpy as np
import urllib.request
import subprocess
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time

## configuration
PORTNAME='COM4'
lock_state = False
count = 0

class Bridge():  # inizializzo la classe bridge

    def setup(self):    # funzione per inizializzare la porta serial e il buffer per la raccolta dati e pacchetti proveniente da arduino
        self.ser = serial.Serial(PORTNAME, 9600, timeout=0)

        # internal input buffer
        self.inbuffer=[]
        


    

    def get_ssid(self): # funzione per ricavare il nome dell' ssid a cui il bridge è connesso
        results = subprocess.check_output(["netsh", "wlan", "show", "interfaces"])
        #print(results)
        results = results.decode("latin1")  # needed in python 3
        results = results.replace("\r", "")
        ls = results.split("\n")
        ls = ls[4:]
        ssids = []
        x = 0
        while x < len(ls): # funzioni per filtrare la variabile a cui siamo interessati
            if x % 5 == 0:
                ssids.append(ls[x])
            x += 1
        string = ssids[3]

        lookingfor = ":"
        for c in range(0, len(string)):
            if string[c] == lookingfor:
                SSID = string[c+2:]

        print(SSID)
        return SSID



    def check_door_remote(self): # funzione che riceve da arduino lo status della porta DA REMOTO

        door=""

        while(self.ser.read(1) != b'\xfb'):

            continue

        print("Inizio pacchetto")
        while(True):

            code = self.ser.read(1)
            if code == b'\xfa':
                print("fine pacchetto\n")
                print(self.inbuffer)
                break
            elif code == b'':
                continue
            else:

                self.inbuffer.append(code)




        for i in range(len(self.inbuffer)):
            char = str(self.inbuffer[i], 'UTF-8')
            door += char

        print(door)
        self.inbuffer=[]
        if door == "001": # porta aperta, non è possibile chiudere la serratura, si attende che l'utente la chiuda
        
            doc = db.collection("dispositivi").document('TP-Link_8579')
            doc.update({"porta": True, "lock": True})
            br.check_door_remote()
                     
        else: # porta chiusa, la serratura viene chiusa
             doc = db.collection("dispositivi").document('TP-Link_8579')
             doc.update({"porta": False, "lock": False})


        return door


    def check_door_local(self): # funzione che riceve da arduino lo status della porta DA LOCALE

        door=""

        while(self.ser.read(1) != b'\xfb'):

            continue

        print("Inizio pacchetto")
        while(True):

            code = self.ser.read(1)
            if code == b'\xfa':
                print("fine pacchetto\n")
                print(self.inbuffer)
                break
            elif code == b'':
                continue
            else:

                self.inbuffer.append(code)




        for i in range(len(self.inbuffer)):
            char = str(self.inbuffer[i], 'UTF-8')
            door += char

        print(door)
        self.inbuffer=[]
        if door == "001": # porta aperta, non è possibile chiudere la serratura, si attende che l'utente la chiuda
        
            doc = db.collection("dispositivi").document('TP-Link_8579')
            doc.update({"porta": True, "lock": True})
            br.check_door_local()  #viene richiamata la funzione per attendere la chiusura della porta e quindi del pacchetto 000
                     
        else: # porta chiusa, la serratura viene chiusa
             doc = db.collection("dispositivi").document('TP-Link_8579')
             doc.update({"porta": False, "lock": False})


        return door



    def write_to_firebase(self,ssid): # funzione eseguita la prima volta per inizializzare la collection relativa al nuovo arduino collegato, creando le variabili opportune

        doc = db.collection("dispositivi").document(ssid)

        doc.set({"SSID": ssid, "lock": True, "latitude": "", "longitude": "",  "porta": False, "allarme": False})
        #latitudine e longitudine sono vuote in quanto verranno scritte dall'applicazione mobile in quanto 
        #il gps sui dispositivi mobili è molto più preciso della geolocalizzazione via web

    def read_from_firebase(self,lock_state,count): # funzione che controlla l'eventuale cambiamento di variabile della serratura

        
        db = firestore.client()


        doc_ref = db.collection(u'dispositivi').document('TP-Link_8579')

        doc = doc_ref.get()
        
        if doc.exists:
            print(f'Document data: {doc.to_dict()}')
        else:
            print(u'No such document!')

        output = doc.to_dict()
        
        lock_state= output.get('lock')
        print(lock_state)
        time.sleep(5)

        doc = doc_ref.get()
        newoutput = doc.to_dict()
        new_lock_state= newoutput.get('lock')

        #while(lock_state == newoutput):
            #doc = doc_ref.get()
           # newoutput = doc.to_dict()
             
        if (lock_state == new_lock_state and count < 3): # se non c'è stata alcuna modifica controllo altre 3 volte e poi esco
            print("WAITING FOR CHANGES....\n")
            count = count + 1
            br.read_from_firebase(lock_state,count)
        if (lock_state == True and new_lock_state == False): # chiudo serratura
            print("Blocco serratura\n")    
            self.ser.write("0".encode())
        if (lock_state == False and new_lock_state == True): # sblocco serratura
            print("Sblocco serratura\n")    
            self.ser.write("1".encode())
            br.check_door_remote() # richiamo la funzione per controllare se la porta viene poi chiusa 


            


    def check_lock(self): # funzione per fare il check di eventuali effrazioni da arduino sfruttando il confronto tra lo status della serratura e della porta
                        # questo check parte solo ed esclusivamente se la serratura è effettivamente chiusa

        lock_state=""


        while(self.ser.read(1) != b'\xfd'):
            continue

        print("Inizio pacchetto")
        while(True):


            code = self.ser.read(1)
            if code == b'\xfc':
                print("fine pacchetto\n")
                print(self.inbuffer)
                break
            elif code == b'':
                continue
            else:

                self.inbuffer.append(code)




        for i in range(len(self.inbuffer)):
            char = str(self.inbuffer[i], 'UTF-8')
            lock_state += char

        
        if lock_state == "OK":
            print("NULLA DA SEGNALARE... SERRATURA OK\n")
            lock_state=""
            self.inbuffer=[]
            doc = db.collection("dispositivi").document('TP-Link_8579')
            doc.update({"allarme": False})

        elif lock_state =="!OK":
            print("ALLARME... SERRATURA CHIUSA MA PORTA APERTA\n")  
            lock_state="" 
            self.inbuffer=[] 
            doc = db.collection("dispositivi").document('TP-Link_8579')
            doc.update({"allarme": True})



        
    

    def check_card_local(self): # funzione che ricevo lo status della parto aperto o chiusa  in locale da arduino

        card =""

        start = time.time()



        while(self.ser.read(1) != b'\x7d'):
            if time.time() > start + 5:
                return
            else:
                continue

        print("Inizio pacchetto")
        while(True):


            code = self.ser.read(1)
            if code == b'\x7e':
                print("fine pacchetto\n")
                print(self.inbuffer)
                break
            elif code == b'':
                continue
            else:

                self.inbuffer.append(code)




        for i in range(len(self.inbuffer)):
            char = str(self.inbuffer[i], 'UTF-8')
            card += char

        if card == "O": #open
            card=""
            self.inbuffer=[]
            br.check_door_local()


    def get_lock_value(self): # funzione che comunica con firebase e ritorna lo status della serratura
        db = firestore.client()


        doc_ref = db.collection(u'dispositivi').document('TP-Link_8579')

        doc = doc_ref.get()
        
        if doc.exists:
            print(f'Document data: {doc.to_dict()}')
        else:
            print(u'No such document!')

        output = doc.to_dict()
        
        lock= output.get('lock')
        print(lock)
        return lock        
            
    def check_alarm(self): # funzione che controlla lo status dell'allarme di tutti gli arduini nel database 
        db = firestore.client()
        time = 10


        doc_ref = db.collection(u'dispositivi').where(u'allarme', u'==', True) # seleziono quelli che hanno l'allarme attivo
        doc = doc_ref.get()
        leng = 0
        if len(doc):
            for docs in doc:
                leng= leng+1   #contatore per controllare se sono stati verificati tutti i dispositivi (latitudine e longitudine) trovati con la query
                output = docs.to_dict()
                latitude= output.get('latitude') # seleziono la latitudine del dispositivo con l'allarme attivo 
                longitude = output.get('longitude') # selezione la longitudine del dispositivo con l'allarme attivo 
                print(latitude)
                print(longitude)

                doc_ref2 = db.collection(u'dispositivi').document('TP-Link_8579')
                doc2 = doc_ref2.get()

                output2 = doc2.to_dict()
                mylatitude= output2.get('latitude') # seleziono la latitudine del mio dispositivo
                mylongitude = output2.get('longitude') # seleziono la longitudine del mio dispositivo
                #print(mylatitude)
            

                if latitude - 0.05 <= mylatitude and mylatitude <= latitude + 0.05 and longitude - 0.05 <= mylongitude and mylongitude <= longitude +0.05: # se mi trovo nel raggio di 10 km 
                # aumento controlli
                    print("EFFRAZIONE NELLE VICINANZE... CHECK PIU' VELOCE ALLA SERRRATURA\n'")
                    time = 2
                    return time
                if leng == len(doc):
                    return time    
        else:
            print(u'No such document!')
            return time
        


        
        

        









if __name__ == '__main__':
    br=Bridge()
    br.setup()
    cred = credentials.Certificate("iot-unimore-firebase-adminsdk-g94mz-af797deabe.json")   #credenziali di firestore
    firebase_admin.initialize_app(cred)   #inizializzazione database
    db = firestore.client()  #richiamo alle api di firebase
    #ssid = br.get_ssid()
    br.check_alarm()
    #br.write_to_firebase(ssid)
    while(1):
        time.sleep(2)
        br.read_from_firebase(lock_state,count)
        count=0
        br.check_card_local()
        if br.get_lock_value() == False:
            print("Time --> " + str(br.check_alarm()))
            time.sleep(br.check_alarm())
            br.check_lock()
        
        
    


