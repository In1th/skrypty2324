from abc import ABC, abstractmethod 

class Event(ABC):

    @abstractmethod
    def handleEvent(self, msg: str): 
        pass

    @abstractmethod
    def getNextMsg(self) -> str: 
        pass

    @abstractmethod
    def isEnd(self) -> bool: 
        pass

    @abstractmethod
    def isNow(self) -> bool:
        pass

class EventStorage:

    def __init__(self) -> None:
        self.events: dict[int, Event] = {}

    def setEvent(self, user: int, ev: Event):
        self.events[user] = ev
    
    def getEvent(self, scenario: int) -> Event:
        if scenario == 1:
            return CreateEvent()
        elif scenario == 2:
            return ListEvent()
        elif scenario == 3:
            return DeleteEvent()

    def clearEvent(self, user):
        if user in self.events:
            self.events.pop(user)

    def getEventFor(self, user):
        if user not in self.events:
            return None
        
        return self.events[user]

class CreateEvent(Event):
    
    def __init__(self) -> None:
        super().__init__()
        self.actionCounter=1
        self.name=''
        self.description=''
        self.date=''

    def handleEvent(self, msg: str): 
        if self.actionCounter == 1:
            self.name = msg
        elif self.actionCounter == 2:
            self.description = msg
        elif self.actionCounter == 3:
            self.date = msg
        self.actionCounter += 1

    def getNextMsg(self) -> str: 
        if self.actionCounter == 2:
            return 'Please describe your event'
        elif self.actionCounter == 3:
            return 'Please tell me when this event will hold place'
        elif self.actionCounter == 4:
            return f'Alright! I\'m booking event:\n{eventFormatter(self.name, self.description, self.date)}\nDo you need anything else?'
        
    def isEnd(self) -> bool: 
        return self.actionCounter == 4
    
    def isNow(self) -> bool:
        return False
    
class ListEvent(Event):
    def __init__(self) -> None:
        super().__init__()
        self.events = ''

    def handleEvent(self, msg: str): 
        self.events = 'One, description, now'

    def getNextMsg(self) -> str: 
        return '\n'.join(['You have those events in next week: ', eventFormatter('Event', 'Description', 'Now')])
        
    def isEnd(self) -> bool: 
        return True
    
    def isNow(self) -> bool:
        return True

class DeleteEvent(Event):
    def __init__(self) -> None:
        super().__init__()
        self.actionCounter = 1
        self.name = ''

    def handleEvent(self, msg: str): 
        if self.actionCounter == 1:
            self.name = msg
        self.actionCounter += 1

    def getNextMsg(self) -> str: 
        return f'Succesfully deleted {self.name}!\nDo you need anything else?'

    def isEnd(self) -> bool: 
        return self.actionCounter == 2
    
    def isNow(self) -> bool:
        return True

def eventFormatter(name, description, date):
    return '\n'.join([f'🪪 {name}',f'📝 {description}',f'📆 at {date}', 'Do you need anything else?'])